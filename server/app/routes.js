module.exports = function(app){
	require('./api/users/users.js').users(app);
}