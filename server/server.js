const path = require('path');
const express = require('express');
const canvas = require('canvas-api-wrapper');
const business = require('./business_logic.js');
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
 * Process:
 * 1. Pulls the tool ID, course list, and options from the request body
 * 2. Runs the discoverIssues() function, which returns a list of items with issues
 * 3. Sends the response with status 400 and the stringified issue items
 ************************************************************************/
app.post('/tool/discovery', async (req, res) => {
  try {
    let {
      tool_id,
      courses,
      options
    } = req.body;

    let issueItems = await business.discoverIssues(tool_id, courses, options);
    res.status(200).send(JSON.stringify(issueItems));
  } catch (e) {
    res.status(400).send(JSON.stringify(e));
  }
});

/*************************************************************************
 * Handles the "issue discovery" sequence for Node Tools
 * How do we add body and option requests and whatnot to jsdocs?
 * @returns {object[]} - Array of Issues
 ************************************************************************/
app.put('/tool/fix', (req, res) => {

  // TODO

});

/* This serves the entire dist folder, allowing the angular files to talk to each other */
app.use(express.static('./dist/katana'));

/* Starts the server */
app.listen(serverPort, () => {
  console.log('Katana Express server has launched on port:', serverPort);
});
