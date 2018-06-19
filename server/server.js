const path = require('path');
const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const node_tools = require('./node_tools.js');
const course_retrieval = require('./course_retrieval.js');
const app = express();
const serverPort = 8000;

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
app.get(['/', '/categories', '/categories/*'], (req, res) => {
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
            res.status(500).send(new Error(`Internal Server Error`));
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
 * @returns {object[]} - Array of Issues
 * Process:
 * 1. Pulls the tool ID, course list, and options from the request body
 * 2. Runs the discoverIssues() function, which returns a list of items with issues
 * 3. Sends the response with status 400 and the stringified issue items
 ************************************************************************/
app.post('/tool/discover', async (req, res) => {
    try {
        let {
            tool_id,
            courses,
            options
        } = req.body;

        await node_tools.discoverIssues(tool_id, courses, options);
        res.status(200).send(courses);
    } catch (e) {
        console.error(e);
        res.status(400).send(e);
    }
});

/*************************************************************************
 * Handles the "issue discovery" sequence for Node Tools.
 * @returns {object[]} - Array of Issues
 ************************************************************************/
app.put('/tool/fix', async (req, res) => {
    try {
        let {
            tool_id,
            courses,
            options
        } = req.body;

        await node_tools.fixIssues(tool_id, courses, options);
        res.status(200).send(courses);
    } catch (e) {
        console.error(e);
        res.status(400).send(e);
    }
});

/* Starts the server */
app.listen(serverPort, () => {
    console.log('Katana Express server has launched on port:', serverPort);
});
