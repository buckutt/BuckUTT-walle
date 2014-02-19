
var fork = require('child_process').fork,
	mongoose = require('mongoose'),
	walker = require('./walker'),
	express = require('express.io');

require('express-namespace');

var mainProcess = process;


/**
 * MongoDB starter
 */
exports.mongo = {
	process: null,

	start: function(callback) {
		var mongoProcess = this.process = fork(__dirname + '/../mongo/mongo'),
			logger = this.log;

		mongoProcess.on('message', function(socket) {
			logger(socket);

            setTimeout(function() {
                callback(socket, mongoProcess);
            }, 2000);
		});
	},

	log: function(socket) {
		console.log(socket.message);

		if (socket.status == 'error') {
			console.log('[System] Terminating ...');

			// Kill MongoDB
			this.process.exit(0);

			// Kill the main process
			mainProcess.exit(0);
		}
	}
};


/**
 * Application starter
 */
exports.app = {
	config: null,
	db: null,
	app: null,
	middlewares: {},

	/**
	 * Initialize the application
	 */
	initialize: function() {
		this.config = this._requireConfig('config.json');
		this.config.root = __dirname + '/..';

		// Connect to the database
		this.db = mongoose.connect(this.config.db, { auto_reconnect: true });

		// Load the models
		walker.walk(this.config.root + '/app/models');

		// Load middlewares
		this.middlewares.auth = this._requireConfig('middlewares/authorization');

		return this;
	},

	/**
	 * Boot the application
	 */
	boot: function() {
		// Start ExpressJS
		this.app = express();
		this.app.mode = 'alive';

		// Enable HTTP and Websockets
		this.app.http().io();

		// Configure ExpressJS
		this._requireConfig('express')(this.app);
		this._requireConfig('routes')(this.app, this.middlewares.auth, this.db);

		// Load global sockets
		require('../sockets')(this.app);

		return this;
	},

	/**
	 * Boot the application
	 */
	run: function() {
		// Listen config port
		this.app.listen(this.config.port);

		this.log('[System] System started, listening port ' + this.config.port);

		return this;
	},

	/**
	 * Log a given message (by default, write it in console)
	 *
	 * @param message
	 */
	log: function(message) {
		console.log(message);
	},

	/**
	 * Require configuration file
	 *
	 * @param path
	 * @returns {*}
	 * @private
	 */
	_requireConfig: function(path) {
		return require('../config/' + path);
	}
};
