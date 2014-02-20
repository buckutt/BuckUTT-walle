'use strict';

/**
 * Services
 */
var services = angular.module('buckutt.services', []);

/*
 * Sockets
 */
services.factory('socket', function ($rootScope) {
	var socket = io.connect();

	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

/*
 * Arena API
 */
services.factory('api', ['$http', function($http) {
	var prefix = '/api';

	var errorCallback = function() {
		alert('Une erreur imprévue s\'est produite. Essayez de recharger la page si le problème persiste.');
	};

	return {
		users: {
			find: function(params, callback) {
				$http({
					method: 'GET',
					url: prefix + '/users',
					params: params
				})
					.success(callback)
					.error(errorCallback);
			}
		},
		teams: {
			find: function(params, callback) {
				$http({
					method: 'GET',
					url: prefix + '/teams',
					params: params
				})
					.success(callback)
					.error(errorCallback);
			}
		},
		animations: {
			find: function(params, callback) {
				$http({
					method: 'GET',
					url: prefix + '/animations',
					params: params
				})
					.success(callback)
					.error(errorCallback);
			}
		},
		headevents: {
			find: function(params, callback) {
				$http({
					method: 'GET',
					url: prefix + '/headevents',
					params: params
				})
					.success(callback)
					.error(errorCallback);
			}
		}
	};
}]);
