angular.module('buckutt.sell', [
  'ui.router'
])

.config(function config($stateProvider) {
  $stateProvider.state( 'sell', {
    url: '/sell',
    views: {
      "main": {
        controller: 'SellCtrl',
        templateUrl: 'app/sell/sell.tpl.html'
      }
    },
    data:{ pageTitle: 'Vente' }
  });
})

.controller('SellCtrl', function SellCtrl($scope) {
})

;
