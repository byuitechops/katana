const path = require('path');
const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const node_tools = require('./node_tools.js');
const course_retrieval = require('./course_retrieval.js');
const app = express();
const serverPort = 8000;
const expressWd = require('express-ws')(app);
const logActions = require('./logging.js');

// REMOVE later on after we don't need it
if (!process.env.canvas_api_token) {
    console.log(chalk.redBright('CANVAS API TOKEN not set. Exiting.'));
    return;
}

// This logs every request made to the server to the console
app.use(morgan(`${chalk.greenBright(':method')} ${chalk.yellowBright(':url')} :status :res[content-length] - :response-time ms`));

// This serves the entire dist folder, allowing the angular files to talk to each other
app.use(express.static('dist/katana'));

// Parses incoming request's body when JSON
app.use(bodyParser.json());


/*************************************************************************
 * Sends the homepage to the user.
 * @returns {page} - Homepage
 ************************************************************************/
app.get(['/', '/categories', '/categories/*', '/categories/*/*', '/home', '/home/*', '/home/*/*'], (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/katana/index.html'))
});

/*************************************************************************
 * Sends the list of courses searched for to the user.
 * @returns {courses[]} - List of courses that match the search criteria
 ************************************************************************/
app.post('/course-retrieval', (req, res) => {
    course_retrieval(req.body)
        .then(courses => {
            res.status(200).send(courses);
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(new Error(`Internal server error`));
        });
});

/*************************************************************************
 * Sends the list of tools to the client.
 * @returns {Tool[]} - List of tools available from the server
 ************************************************************************/
app.get('/tool-list', (req, res) => {
    let toolArray = Object.keys(node_tools.toolList).map(key => node_tools.toolList[key]);
    res.send(toolArray);
});

/*************************************************************************
 * Handles the "issue discovery" sequence for Node Tools
 * @returns {Course} - The course provided in the message
 ************************************************************************/
app.ws('/tool/discover', (ws, req) => {
    ws.on('message', async (dataString) => {
        try {
            let data = JSON.parse(dataString);
            let startDate = new Date();
            await node_tools.discoverIssues(data.tool_id, data.course, data.options);
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
                    courseId: data.course.id
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
        // Log here
        logActions.logServer();
        console.error('Web Socket closed by client.');
    });
});

/*************************************************************************
 * Handles the "issue fix" sequence for Node Tools
 * @returns {Course} - The course provided in the message
 ************************************************************************/
app.ws('/tool/fix', (ws, req) => {
    ws.on('message', async (dataString) => {
        try {
            let data = JSON.parse(dataString);
            let startDate = new Date();
            await node_tools.fixIssues(data.tool_id, data.course, data.options);
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
                    courseId: data.course.id
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
        // Log here
        logActions.logServer();
        console.error('Web Socket closed by client.');
    })
});

/* Starts the server */
app.listen(serverPort, () => {
    console.log('Katana Server has launched on port:', serverPort);
});