angular.module('buckutt', [
  'ui.router',
  'buckutt.sell',
  'buckutt.connection'
])

.config(function myAppConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('connection');
})

.run(function run () {
})

.controller('AppCtrl', function AppCtrl($scope, $location) {
})

;

