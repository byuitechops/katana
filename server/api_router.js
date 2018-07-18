/* Express Modules */
const express = require('express');
const apiRouter = express.Router();

/* Katana modules */
const firebaseWrapper = require('./firebase_wrapper.js');
const logActions = require('./logging.js');
const node_tools = require('./node_tools.js');
const course_retrieval = require('./course_retrieval.js');

/* Initializes the firebase */
firebaseWrapper.initializeFirebase();

/*************************************************************************
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

/*************************************************************************
 * Sends the list of tools to the client.
 * @returns {Tool[]} - List of tools available from the server
 ************************************************************************/
apiRouter.post('/tool-list', (req, res) => {
    let toolArray = Object.keys(node_tools.toolList).map(key => node_tools.toolList[key]);
    res.send(toolArray);
});

/*************************************************************************
 * Sends the list of courses searched for to the user.
 * @returns {courses[]} - List of courses that match the search criteria
 ************************************************************************/
apiRouter.post('/user-status', (req, res) => {
    console.log(`${req.body.message} | ${req.body.userEmail} | ${new Date()}`);
    firebaseWrapper.userLog({email: req.body.userEmail, action: req.body.message});
});

/*************************************************************************
 * Handles the "issue discovery" sequence for Node Tools
 * @returns {Course} - The course provided in the message
 ************************************************************************/
apiRouter.ws('/tool/discover', (ws, req) => {
    ws.on('message', async (dataString) => {
        try {
            let data = JSON.parse(dataString);
            let startDate = new Date();
            await node_tools.discoverIssues(data.tool_id, data.course, data.options, data.userEmail);
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
        // Log here
        logActions.logServer();
        console.error('Web Socket closed by client.');
    });
});

/*************************************************************************
 * Handles the "issue fix" sequence for Node Tools.
 * @returns {Course} - The course the tool ran on. Includes fixed IssueItems.
 ************************************************************************/
apiRouter.ws('/tool/fix', (ws, req) => {
    ws.on('message', async (dataString) => {
        try {
            let data = JSON.parse(dataString);
            let startDate = new Date();
            await node_tools.fixIssues(data.tool_id, data.course, data.options, data.userEmail);
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
});

module.exports = apiRouter;