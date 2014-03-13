angular.module('buckutt.sell.interface', [
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'sell.interface', {
            url: '/interface',
            views: {
                "main": {
                    controller: 'InterfaceCtrl',
                    templateUrl: 'app/sell/interface/interface.tpl.html'
                }
            },
            data:{ pageTitle: 'Interface' }
        })
    })

    .factory('Purchases', function($resource) {
        return $resource('/api/purchases');
    })

    .controller('InterfaceCtrl', function InterfaceCtrl($scope, $state, $rootScope, Purchases) {
        if(!$rootScope.isSeller || !$rootScope.isLogged) $state.transitionTo('connection.status', {error:3});
        if(!$rootScope.buyer) $state.transitionTo('sell.waiter', {error:1});

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
                    "id":"dinde",
                    "name":"Bande de dinde",
                    "price":"1"
                },
                {
                    "id":"oasis",
                    "name":"Oasis",
                    "price":"0.60"
                }
            ],
            "barres" : [
                {
                    "id":"mars",
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

        var cart = [];

        $scope.addProduct = function(product) {
            var isFound = false;
            for(item in cart) {
                if(cart[item].product.id == product.id) {
                    cart[item].quantity++;
                    isFound = true;
                }
            }
            if(!isFound) {
                cart.push({
                    "product":product,
                    "quantity":1
                });
            }

            $scope.cart = cart;
        };

        $scope.deleteProduct = function(item) {
            var index = cart.indexOf(item);
            if(index > -1) {
                cart.splice(index,1);
            }
            $scope.cart = cart;
        };

        $scope.sendPurchases = function() {
            var newPurchases = new Purchases();
            newPurchases.products = $scope.cart;
            newPurchases.$save();
        }

    })

;