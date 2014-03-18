var express = require('express');
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');


//Objects that can be changed at any time and must be updated everywhere
var dependency = {};


//Load config
dependency.config = JSON.parse(fs.readFileSync("./server/config.json"));

//Mysql connection
function newMysqlConn(){
    dependency.dbConnection = mysql.createConnection(dependency.config.mysql);

    try{
        dependency.dbConnection.connect(function(err, res){
            if (err){
                console.log("Can't connect to mysql, retry...");
                setTimeout(newMysqlConn, 1000);
            }
            else{
                console.log("Connected to mysql");
            }
        });
        
        dependency.dbConnection.on('error', function(err){
            console.log("Mysql error: "+err);
            newMysqlConn();
        });       
    }
    catch(err){console.log("mdrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")}
}


newMysqlConn();



//Web server
dependency.app = express()
.use(express.static(path.join(__dirname, '../../client/src')));

require('./routes.js')(dependency);

dependency.app.listen(8080);
console.log("Listening on 8080");
