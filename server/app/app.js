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
    catch(err){}
}


newMysqlConn();


//Web server
dependency.app = express()
.use(express.json())
.use(express.static(path.join(__dirname, '../../client/src')));

require('./routes.js')(dependency);

//404 error
dependency.app.use(function(req, res, next){
    res.sendfile(path.resolve('client/src/assets/img/404.png'));
});

dependency.app.listen(8081);
console.log("Listening on 8081");
