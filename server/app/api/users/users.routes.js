module.exports = function(app, users){
    require('./log/in/login.js').login(app, users);
    require('./log/out/logout.js').logout(app, users);
}