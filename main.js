var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');

// Use Port 3000 or whatever the user specifices in their env variables
app.set('port', process.env.PORT || 3000);

// Sets up the logger for Express
app.use(logger('dev'));

// Statically serve the public folder, so everything in it can be accessed on the client side
app.use(express.static('public'));

app.get('/', (req, res) => {
    var filePath = path.resolve('.') + '\\public\\views\\index.html';
    res.sendFile(filePath);
});

app.listen(3000);
console.log('Server now listening...');