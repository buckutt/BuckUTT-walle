module.exports = function(app, dbConnection){
	var users = require('./api/users/users.js');
    var products = require('./api/products/products.js');
    var purchases = require('./api/purchases/purchases.js');
    var points = require('./api/points/points.js');

    users.users(app, dbConnection);
    products.products(app, dbConnection);
	purchases.purchases(app, dbConnection, users, products);
    points.points(app, dbConnection);
}