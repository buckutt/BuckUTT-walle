'use strict';

/**
 * Filters
 */
var filters = angular.module('buckutt.filters', []);

filters.filter('nl2br', function() {
	return function(text) {
		return text.replace("\n", '<br />');
	}
});

filters.filter('moment_format', function() {
	return function(date, format) {
		return moment(date).format(format);
	}
});

filters.filter('moment_from_now', function() {
	return function(date) {
		return moment(date).fromNow();
	}
});
