
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	config = require('../../../config/config.json'),
	_ = require('underscore'),
	tools = require('../../lib/tools.js');

// Models
var User = mongoose.model('User');

/**
 * Update the avatar
 */
exports.changeAvatar = function(req) {
	User.findOne({ token: req.data.token }, function(err, user) {
		if (user) {
			user.avatar = req.data.avatar;
			user.save(function() {
				console.log('[System] '+ req.session.user.email + ' changed avatar to ' + req.data.avatar);
			});
		}
	});
};

/**
 * Update the password
 */
exports.changePassword = function(req) {
	User.findOne({ token: req.data.token }, function(err, admin) {
		if (err) { throw err; }

		if (admin && admin.role == 'admin') {
			User.findOne({ _id: req.data.user._id }, function(err, user) {
				if (user) {
					user.hashed_password = user.encrypt(req.data.user.password);

					user.save(function(err) {
						if (err) { throw err; }

						console.log('[System] '+ user.email + ' changed password');

						req.io.emit('user:change-password:result');

						console.log(user);
					});
				}
			});
		} else {
			console.log('[Hacking] '+admin.email+ ' tried to access users.changePassword without authorizations');
		}
	});
};

/**
 * Create an user
 */
exports.create = function(req) {
	User.findOne({ token: req.data.token }, function(err, admin) {
		if (err) { throw err; }

		if (admin && admin.role == 'admin') {
			User.find({}, function(err, users) {
				if (err) { throw err; }

				var colors = { red: 0, blue: 0 };

				_.each(users, function(user) {
					if (user.color == 'blue') {
						colors.blue++;
					} else {
						colors.red++;
					}
				});

				var userColor = 'blue';

				if (colors.blue > colors.red) {
					userColor = 'red';
				}

				var user = new User({
					email           : req.data.user.email,
					password        : req.data.user.password,
					firstname       : req.data.user.firstname,
					lastname        : req.data.user.lastname,
					nickname        : req.data.user.nickname,
					slug            : tools.string.slugify(req.data.user.nickname),
					city            : req.data.user.city,
					postalCode      : req.data.user.postalCode,
					country         : req.data.user.country,
					isUTT           : req.data.user.isUTT,
					role            : 'player',
					colorPoints     : 0,
					games           : [],
					achievements    : [],
					color           : userColor,
					avatar          : 'default.png',
					isEnabled       : true
				});

				user.token = crypto.createHash('sha512').update(user.makeSalt()).digest('base64').substr(0, 64);

				user.save(function(err) {
					if (err) { throw err; }

					req.io.emit('user:create:result');
				});
			});
		} else {
			console.log('[Hacking] '+admin.email+ ' tried to access users.changePassword without authorizations');
		}
	});
};
