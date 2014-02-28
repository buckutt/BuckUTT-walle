var express = require('express');
var path = require('path');

var app = express()
.use(express.static(path.join(__dirname, '../../client/src')));

require('./routes.js')(app);

app.listen(8080);

