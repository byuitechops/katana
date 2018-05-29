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
 ************************************************************************/
app.get('/tools/*', async (req, res) => {
  try {
    let {
      tool_id,
      courses,
      options
    } = req.body;

    let issueItems = await business.discoverIssues(tool_id, courses, options);

    if (typeof issueItems === 'string') {
      res.send('Invalid Tool ID');
    } else {
      res.status(200).send(JSON.stringify(issueItems));
    }

  } catch (e) {
    res.status(400).send(e.message);
  }
});

/*************************************************************************
 * Handles the "issue discovery" sequence for Node Tools
 * How do we add body and option requests and whatnot to jsdocs?
 * @returns {object[]} - Array of Issues
 ************************************************************************/
app.put('/tools/*', (req, res) => {
  // TODO Add to business logic
  res.send('This is for testing the PUT request - Please remove!');
});

/* This serves the entire dist folder, allowing the angular files to talk to each other */
app.use(express.static('./dist/katana'));

/* Starts the server */
app.listen(serverPort, () => {
  console.log('Katana Express server has launched on port:', serverPort);
});
