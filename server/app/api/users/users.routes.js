module.exports = function(container){
    container.log = {};

    container.log.in = require('./log/in/login.js');
    container.log.out = require('./log/out/logout.js');

    container.log.in.login(container);
    container.log.out.logout(container);
}