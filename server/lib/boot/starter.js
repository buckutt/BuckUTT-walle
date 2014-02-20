
var fork = require('child_process').fork,
	mongoose = require('mongoose'),
	walker = require('./walker'),
	express = require('express.io');

var mainProcess = process;


/**
 * MongoDB starter
 */
exports.mongo = {
	process: null,

	start: function(callback) {
		var mongoProcess = this.process = fork(__dirname + '/../../bin/start-mongo'),
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
        var root = __dirname + '/../..';

		this.config = require(root + '/app/config.json');
		this.config.root = root;

		// Connect to the database
		this.db = mongoose.connect(this.config.db, { auto_reconnect: true });

		// Load the models
		walker.walk(this.config.root + '/src/models');

		// Load middlewares
		this.middlewares.auth = require(root + '/lib/middlewares/authorization');

		return this;
	},

	/**
	 * Boot the application
	 */
	boot: function() {
        require('express-namespace');

        // Start ExpressJS
        this.app = express();
        this.app.mode = 'alive';

        // Enable HTTP and Websockets
        this.app.http().io();

        // Configure ExpressJS
        require(this.config.root + '/app/express')(this.app);
        require(this.config.root + '/app/routes')(this.app, this.middlewares.auth, this.db);

        // Load global sockets (optionnal)
        // require('../sockets')(this.app);

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
	}
};
