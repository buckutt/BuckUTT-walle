
// Load libraries
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	_ = require('underscore');

var starter = require('../arena/starter');

starter.app.initialize();

// Create models
var User = mongoose.model('User');

var counter = 1;

for (var i = 1; i <= 5; i++) {
	var user = new User({
		slug            : 'test'+i,
		email           : 'test'+i+'@gmail.com',
		password        : 'test'+i,
		firstname       : 'Test',
		lastname        : 'Test'+i,
		nickname        : 'test'+i,
		city            : 'Troyes',
		postalCode      : '10000',
		country         : 64,
		color           : 'blue',
		colorPoints     : 0,
		games           : ['starcraft', 'lol', 'aoe2'],
		avatar          : '',
		achievements    : [],
		isEnabled       : true,
		isUTT           : true,
		role            : 'player',
		spotlightTeam   : null
	});

	user.token = crypto.createHash('sha512').update(user.makeSalt()).digest('base64').substr(0, 64);

	user.save(function(err) {
		if (err) { throw err; }

		counter++;

		if (counter == 5) {
			console.log('[Fixtures] Users loaded');
			process.exit(0);
		}
	});
}
