
var starter = require('./lib/boot/starter');

starter.mongo.start(function() {
	starter.app
		.initialize()
		.boot();

	exports = module.exports = starter.app;
});
