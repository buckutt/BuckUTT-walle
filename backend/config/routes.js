
var crudify = require('crudify');

module.exports = function(app, auth, db) {
	var controllersPath = '../app/controllers/';


	/**
	 * HTTP controllers
	 */
	var index = require(controllersPath + 'http/index');

	index.app = app;

	// Home
	app.get('/', [auth.mustBeConnected], index.index);

	// Check connection (return a simple 204)
	app.get('/check-connection', index.checkConnection);

	/**
	 * Realtime controllers
	 *
	var users = require(controllersPath + 'realtime/users'),
		teams = require(controllersPath + 'realtime/teams'),
		tournaments = require(controllersPath + 'realtime/tournaments'),
		matchs = require(controllersPath + 'realtime/matchs'),
		head_events = require(controllersPath + 'realtime/head_events');

	teams.app = app;
	tournaments.app = app;
	matchs.app = app;
	head_events.app = app;

	// Head events
	app.io.route('head-events:edit', head_events.edit);

	// Users
	app.io.route('user:me:change-avatar', users.changeAvatar);
	app.io.route('user:create', users.create);
	app.io.route('user:change-password', users.changePassword);

	// Teams
	app.io.route('team:create', teams.create);
	app.io.route('team:join', teams.join);

	// Tournaments
	app.io.route('tournament:create', tournaments.create);
	app.io.route('tournament:edit', tournaments.edit);
	app.io.route('tournament:edit:tree', tournaments.editTree);
	app.io.route('tournament:delete', tournaments.delete);

	app.io.route('tournament:join:user', tournaments.joinUser);
	app.io.route('tournament:validate:user', tournaments.validateUser);
	app.io.route('tournament:refuse:user', tournaments.refuseUser);
	app.io.route('tournament:remove:user', tournaments.removeUser);

	app.io.route('tournament:join:team', tournaments.joinTeam);
	app.io.route('tournament:validate:team', tournaments.validateTeam);
	app.io.route('tournament:refuse:team', tournaments.refuseTeam);
	app.io.route('tournament:remove:team', tournaments.removeTeam);

	app.io.route('tournament:participating', tournaments.participating);

	// Matchs
	app.io.route('matchs:init', matchs.initialize);


	/**
	 * API access : expose our models from the database
	 */
	app.namespace('/api', function() {
		var api = crudify(db);

		/*api.expose('User');
		api.expose('Team');
		api.expose('HeadEvent');
		api.expose('Animation');*/

		api.hook(app);
	});
};
