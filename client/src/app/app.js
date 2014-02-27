angular.module('buckutt', [
  'ui.router',
  'buckutt.sell'
])

.config(function myAppConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('');
})

.run(function run () {
})

.controller('AppCtrl', function AppCtrl($scope, $location) {
})

;

