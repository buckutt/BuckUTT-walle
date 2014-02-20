
/**
 * Generic authoizations middlewares
 */

exports.mustBeAnonymous = function(req, res, next) {
    next();
    return;

	if (req.session.user) {
		return res.redirect('/');
	}
};

exports.mustBeConnected = function(req, res, next) {
    next();
    return;

	if (! req.session.user) {
		return res.redirect('/user/login?e=forbidden');
	}
};

exports.mustBeAdmin = function(req, res, next) {
    next();
    return;

	if (! req.session.user.role == 'admin' && ! req.session.user.role == 'animator') {
		return res.redirect('/?e=forbidden');
	}
};
