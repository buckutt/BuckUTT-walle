
var crudify = require('crudify');

module.exports = function(app, auth, db) {
	var controllersPath = '../src/controllers/';


	/**
	 * HTTP controllers
	 */
	var index = require(controllersPath + 'http/index');

	index.app = app;

	// Home
	app.get('/', [auth.mustBeConnected], index.index);
};
