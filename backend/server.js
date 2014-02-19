
var starter = require('./arena/starter');

starter.mongo.start(function() {
	starter.app
		.initialize()
		.boot()
		.run();

	exports = module.exports = starter.app;
});
