module.exports = function(container){
	container.users = require('./api/users/users.js');
    container.products = require('./api/products/products.js');
    container.purchases = require('./api/purchases/purchases.js');
    container.points = require('./api/points/points.js');

    container.users.users(container);
    container.products.products(container);
	container.purchases.purchases(container);
    container.points.points(container);
}