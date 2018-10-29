// REMOVE later on after we don't need it
if (!process.env.canvas_api_token) {
    console.log('CANVAS API TOKEN not set. Exiting.');
    return;
}

/** Dependencies */
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const app = express();
const expressWd = require('express-ws')(app); // It says the variable is unused, but it is setting up needed methods
const settings = require('./settings.json');

// This logs every request made to the server to the console (if set to true in settings file)
if (settings.console.requests === true) {
    const morgan = require('morgan');
    app.use(morgan(`${chalk.greenBright(':method')} ${chalk.yellowBright(':url')} :status :res[content-length] - :response-time ms`));
}

app.use(express.static('dist/katana'));
app.use(bodyParser.json());

/** Serves the homepage */
app.get(['/', '/home*', '/categories*'], (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/katana/index.html'));
});

/** Serves the release notes */
app.get('/release-notes', (req, res) => {
    res.sendFile(path.join(__dirname, './release_notes.html'));
});

/********************************************************** API ROUTES ***********************************************************/

/** Express Modules */
const authGuard = require('./auth_guard.js');

/** Katana modules */
const firebaseWrapper = require('./firebase_wrapper.js');
const logActions = require('./logging.js');
const tool_prep = require('./tool_prep.js');
const course_retrieval = require('./course_retrieval.js');

/** Initializes the firebase */
firebaseWrapper.initializeFirebase();

var apiRouter = express.Router();
apiRouter.use(authGuard);

/** ***********************************************************************
 * Sends the list of courses searched for to the user.
 * @returns {courses[]} - List of courses that match the search criteria
 ************************************************************************/
apiRouter.post('/course-retrieval', (req, res) => {
    course_retrieval(req.body)
        .then(courses => {
            res.status(200).send(courses);
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(new Error('Internal server error'));
        });
});

/** ***********************************************************************
 * Makes a copy of the course and sends the download link back to the user.
 * @returns {string} - Link to download the course ".imscc" file
 ************************************************************************/
apiRouter.post('/course-make-backup', (req, res) => {
    make_downloadable_backup(req.body)
        .then(exportedContent => {
            res.status(200).send(exportedContent);
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(new Error('Internal server error'));
        });
});

/** ***********************************************************************
 * Sends the list of tools to the client.
 * @returns {Tool[]} - List of tools available from the server
 ************************************************************************/
apiRouter.get('/tool-list', (req, res) => {
    let toolArray = Object.keys(tool_prep.toolList).map(key => tool_prep.toolList[key]);
    res.send(toolArray);
});

/** ***********************************************************************
 * Sends the list of courses searched for to the user.
 * @returns {courses[]} - List of courses that match the search criteria
 ************************************************************************/
apiRouter.post('/user-status', (req, res) => {
    console.log(`${req.body.message} | ${req.body.userEmail} | ${new Date()}`);
    firebaseWrapper.userLog({email: req.body.userEmail, action: req.body.message});
});

/** ***********************************************************************
 * Handles the "issue discovery" sequence for Node Tools
 * @returns {Course} - The course provided in the message
 ************************************************************************/
apiRouter.ws('/tool/discover', (ws, req) => {
    ws.on('message', async (dataString) => {
        try {
            let data = JSON.parse(dataString);
            let startDate = new Date();
            await tool_prep.discoverIssues(data.tool_id, data.course, data.options, data.userEmail);
            let endDate = new Date();

            // Push the data to the log
            logActions.serverLogs.push({
                date: `${startDate.getDate()}/${startDate.getMonth()}/${startDate.getFullYear()}`,
                startTime: `${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}.${startDate.getMilliseconds()}`,
                endTime: `${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}.${endDate.getMilliseconds()}`,
                action: 'node_tool',
                details: {
                    tool: data.tool_id,
                    mode: 'discover',
                    courseId: data.course.id,
                    employeeEmail: data.userEmail
                }
            });

            if (ws.readyState !== 2 && ws.readyState !== 3) {
                ws.send(JSON.stringify(data.course));
            }

        } catch (e) {
            console.error(e);
            let data = JSON.parse(dataString);
            data.course.error = 'Internal server error while processing course. Please contact a Katana developer with the course ID and tool name.';

            if (ws.readyState !== 2 && ws.readyState !== 3) {
                ws.send(JSON.stringify(data.course));
            }
        }
    });

    ws.on('close', () => {
        logActions.logServer();
        console.error('Web Socket closed by client.');
    });

    // Let the client know it can start sending messages
    ws.send(JSON.stringify({state: 'READY'}));
});

/** ***********************************************************************
 * Handles the "issue fix" sequence for Node Tools.
 * @returns {Course} - The course the tool ran on. Includes fixed IssueItems.
 ************************************************************************/
apiRouter.ws('/tool/fix', (ws, req) => {
    ws.on('message', async (dataString) => {
        try {
            let data = JSON.parse(dataString);
            let startDate = new Date();
            await tool_prep.fixIssues(data.tool_id, data.course, data.options, data.userEmail);
            let endDate = new Date();

            // Push the data to the log
            logActions.serverLogs.push({
                date: `${startDate.getDate()}/${startDate.getMonth()}/${startDate.getFullYear()}`,
                startTime: `${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}.${startDate.getMilliseconds()}`,
                endTime: `${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}.${endDate.getMilliseconds()}`,
                action: 'node_tool',
                details: {
                    tool: data.tool_id,
                    mode: 'fix',
                    courseId: data.course.id,
                    employeeEmail: data.userEmail
                }
            });

            if (ws.readyState !== 2 && ws.readyState !== 3) {
                ws.send(JSON.stringify(data.course));
            }
        } catch (e) {
            console.error(e);
            let data = JSON.parse(dataString);
            data.course.error = 'Internal server error while processing course. Please contact a Katana developer with the course ID and tool name.';

            if (ws.readyState !== 2 && ws.readyState !== 3) {
                ws.send(JSON.stringify(data.course));
            }
        }
    });

    ws.on('close', () => {
        logActions.logServer();
        console.error('Web Socket closed by client.');
    });

    // Let the client know it can start sending messages
    ws.send(JSON.stringify({state: 'READY'}));
});

// Connect the apiRouter endpoints to the server
app.use('/api', apiRouter);

// Starts the server
app.listen(settings.server.port, () => {
    console.log(`Katana Server has launched on port ${settings.server.port}.`);
});