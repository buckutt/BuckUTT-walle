var express = require('express');
var path = require('path');

var app = express()
.use(express.static(path.join(__dirname, '../../client/src')))
.listen(8080);