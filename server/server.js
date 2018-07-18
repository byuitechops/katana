// REMOVE later on after we don't need it
if (!process.env.canvas_api_token) {
    console.log(chalk.redBright('CANVAS API TOKEN not set. Exiting.'));
    return;
}

/* Dependencies */
const path = require('path');
const express = require('express');
const fs = require('fs');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const app = express();
const expressWd = require('express-ws')(app);

// Settings File
const settings = require('./settings.json');

// This logs every request made to the server to the console (if set to true in settings file)
if (settings.console.requests === true) {
    const morgan = require('morgan');
    app.use(morgan(`${chalk.greenBright(':method')} ${chalk.yellowBright(':url')} :status :res[content-length] - :response-time ms`));
}

// This serves the entire dist folder, allowing the angular files to talk to each other
app.use(express.static('dist/katana'));

// Parses incoming request's body when JSON
app.use(bodyParser.json());

// Handles homepage get requests
app.get(['/', '/home*', '/categories*'], (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/katana/index.html'))
});

// API Router (Handles ALL API requests and puts them behind firebase authentication guard)
const apiRouter = require('./api_router.js');

// Set express to user the API Router to handle API calls
app.use('/api', apiRouter);

// Starts the server
let server = app.listen(settings.server.port, () => {
    console.log('Katana Server has launched.');
});