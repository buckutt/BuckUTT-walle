/**
 * Module dependencies.
 */
var connect = require('connect'),
	express = require('express'),
	mongoStore = require('connect-mongo')(express),
	config = require('./config');

module.exports = function(app) {
	app.set('showStackError', true);

	//Should be placed before express.static
	app.use(express.compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	//Setting the static folder
	app.use(express.static(config.root + '/../frontend'));

	//Set views path, template engine and default layout
	app.set('views', config.root + '/../frontend/views');
	app.set('view engine', 'ejs');

	//Enable jsonp
	app.enable("jsonp callback");

	app.configure(function() {
		//cookieParser should be above session
		app.use(express.cookieParser());

		//bodyParser should be above methodOverride
		app.use(connect.urlencoded());
		app.use(connect.json());
		app.use(express.methodOverride());

		//express/mongo session storage
		/*app.use(express.session({
			secret: 'MEAN',
			store: new mongoStore({
				url: config.db,
				collection: 'sessions'
			})
		}));*/

		//routes should be at the last
		app.use(app.router);

		//Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
		app.use(function(err, req, res, next) {
			//Treat as 404
			if (~err.message.indexOf('not found')) {
				return next();
			}

			//Log it
			console.error(err.stack);

			//Error page
			res.status(500).render('errors/500.ejs', {
				error: err.stack
			});
		});

		//Assume 404 since no middleware responded
		app.use(function(req, res, next) {
			res.status(404).render('errors/404.ejs', {
				url: req.originalUrl,
				error: 'Not found'
			});
		});
	});
};
