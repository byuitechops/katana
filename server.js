const path = require('path');
const express = require('express');
const canvas = require('canvas-api-wrapper');
const app = express();
const serverPort = 8000;

/*************************************************************************
 * Sends the homepage to the user.
 * @returns {page} - Homepage
 ************************************************************************/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/katana/index.html'))
});

/*************************************************************************
 * Handles the "issue discovery" sequence for Node Tools
 * @returns {object[]} - Array of Issues
 ************************************************************************/
app.get('/tools/*', (req, res) => {
  /* Get the courses from the query string */
  let courseList = req.query.courses.map(courseId => canvas.getCourse(courseId));

  let allIssues = courseList.reduce((acc, course) => {
    let issues = fixTool.discovery(course, req.query);
    return [...acc, ...issues];
  }, []);

  // TODO Save to Database

  res.send(JSON.stringify(allIssues)); // SEND ISSUES FROM DATABASE, NOT ALLISSUES
});

/*************************************************************************
 * Handles the "issue discovery" sequence for Node Tools
 * How do we add body and option requests and whatnot to jsdocs?
 * @returns {object[]} - Array of Issues
 ************************************************************************/
app.put('/tools/*', (req, res) => {
  res.send('This is for testing the PUT request - Please remove!');
});

/* This serves the entire dist folder, allowing the angular files to talk to each other */
app.use(express.static('./dist/katana'));

/* Starts the server */
app.listen(serverPort, () => {
  console.log('Katana Express server has launched on port:', serverPort);
});
