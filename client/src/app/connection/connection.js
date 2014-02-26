angular.module('buckutt.connection', [
  'ui.router'
])

.config(function config($stateProvider) {
  $stateProvider.state( 'connection', {
    url: '/connection',
    views: {
      "main": {
        controller: 'ConnCtrl',
        templateUrl: 'app/connection/connection.tpl.html'
      }
    },
    data:{ pageTitle: 'Connection' }
  });
})

.controller('ConnCtrl', function SellCtrl($scope) {
})

;
