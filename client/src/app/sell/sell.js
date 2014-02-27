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

        $scope.categories = [
            {
                "id":"accueil",
                "name":"Accueil"
            },
            {
                "id":"canettes",
                "name":"Canettes"
            },
            {
                "id":"barres",
                "name":"Barres"
            }
        ];

        var products = {
            "accueil" : [

            ],
            "canettes" : [
                {
                    "name":"Bande de dinde",
                    "price":"1"
                },
                {
                    "name":"Oasis",
                    "price":"0.60"
                }
            ],
            "barres" : [
                {
                    "name":"Mars",
                    "price":"0.50"
                }
            ]
        };

        var currentCategory = "canettes";
        $scope.actualProducts = products[currentCategory];

        $scope.isActive = function(category) {
            if (category.id == currentCategory) {
                return true;
            }
            return false;
        };

        $scope.switchCategory = function(id) {
            currentCategory = id;
            $scope.actualProducts = products[id];
        };

        $scope.addProduct = function(product) {

        };
})

;