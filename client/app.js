
// Declare app level module which depends on filters, and services
var app = angular.module('buckutt', [
	// External libraries
	'ui.bootstrap',

	// Angular
	'ngRoute',
	'ngResource',

	// Configuration
	'buckutt.directives',
	'buckutt.filters',
	'buckutt.services',

	// Controllers
	'buckutt.controllers.main'
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider

		.when('/', {
			templateUrl: 'views/partials/index.html',
			controller: 'IndexController'
		})

		// Fallback
		.otherwise({
			redirectTo: '/'
		});
}]);
