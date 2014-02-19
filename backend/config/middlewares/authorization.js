
/**
 * Generic authoizations middlewares
 */

exports.mustBeAnonymous = function(req, res, next) {
	if (req.session.user) {
		return res.redirect('/');
	}

	next();
};

exports.mustBeConnected = function(req, res, next) {
	if (! req.session.user) {
		return res.redirect('/user/login?e=forbidden');
	}

	next();
};

exports.mustBeAdmin = function(req, res, next) {
	if (! req.session.user.role == 'admin' && ! req.session.user.role == 'animator') {
		return res.redirect('/?e=forbidden');
	}

	next();
};
