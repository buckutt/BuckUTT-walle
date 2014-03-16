module.exports = function(app, dbConnection){
	require('./api/users/users.js').users(app, dbConnection);
    require('./api/products/products.js').products(app, dbConnection);
	require('./api/purchases/purchases.js').purchases(app, dbConnection);
}