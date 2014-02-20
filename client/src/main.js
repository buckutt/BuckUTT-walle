'use strict';

/* Controllers */
var main = angular.module('buckutt.controllers.main', []);

/**
 * Clock
 */
main.controller('MainController', function($scope, socket) {
	socket.on('event:name', function(args) {
		$scope.args = args;
	});
});
