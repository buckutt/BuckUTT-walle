module.exports = function(app, users){
    require('./in/login.js').login(app, users);
    require('./out/logout.js').logout(app, users);
}