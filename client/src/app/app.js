angular.module('buckutt', [
  'ui.router',
  'ngResource',
  'ngCookies',
  'buckutt.sell',
  'buckutt.connection'
])

.config(function myAppConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('connection/status');
})

.run(function run () {
})

.controller('AppCtrl', function AppCtrl($scope, $location) {
})

;

