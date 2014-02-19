
var config = require('../../../config/config.json'),
	_ = require('underscore'),
	mongoose = require('mongoose'),
	moment = require('moment');

exports.app = null;

exports.index = function(req, res) {
    res.render('index.ejs', {
        user: user,
        error: error,
        chat: config.chat,
        channels: channelsString.join(),
        context: context.compile()
    });
};

exports.checkConnection = function(req, res) {
    res.send('Connected');
};