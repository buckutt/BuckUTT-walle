var express = require('express');
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');


//Load config
var config = JSON.parse(fs.readFileSync("./server/config.json"));

//Test
//Mysql connection
var dbConnection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

dbConnection.connect(function(err, res){
	if (err) throw err;
});


//Web server
var app = express()
.use(express.static(path.join(__dirname, '../../client/src')));

require('./routes.js')(app, dbConnection);

app.listen(8080);
