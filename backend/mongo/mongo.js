
var configFile = __dirname + '/mongo.conf',
	exec = require('child_process').exec;

process.send({
	status: 'info',
	message: '[MongoDB] MongoDB started, listening 127.0.0.1:27017'
});

exec('mongod -f "'+ configFile +'"', function (error, stdout) {
	if (error !== null) {
		process.send({
			status: 'error',
			message: '[MongoDB] Error: '+ stdout
		});
	}
});
