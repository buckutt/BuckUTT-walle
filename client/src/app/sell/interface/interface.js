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

    .factory('Products', ['$resource', function($resource) {
        return $resource('/api/products/buyer_id=:buyer_id&point_id=:point_id', {buyer_id:"", point_id:""}, {'get':  {method:'GET', isArray:true}});
    }])

    .factory('Purchases', function($resource) {
        return $resource('/api/purchases');
    })

    .controller('InterfaceCtrl', function InterfaceCtrl($scope, $state, $rootScope, $cookieStore, Products, Purchases) {
        if(!$rootScope.isSeller || !$rootScope.isLogged) $state.transitionTo('connection.status', {error:3});
        if(!$rootScope.buyer) $state.transitionTo('sell.waiter', {error:1});
        else {
            $scope.buyer = $rootScope.buyer;

            var currentCategory = "Accueil";
            $scope.categories = [];
            var products = {};

            var getProducts = Products.get({buyer_id: $scope.buyer.id, point_id: $cookieStore.get("pointId")}, function () {
                for(var productKey in getProducts) {
                    var product = getProducts[productKey];
                    if(product.category == null) {
                        product.category = "Accueil";
                    }
                    if(!products[product.category]) {
                        $scope.categories.push({
                            "id": product.category,
                            "name": product.category
                        });
                        products[product.category] = [];
                    }
                    if(product.obj_type == "product") products[product.category].push(product);
                }

                $scope.switchCategory(currentCategory);
                $scope.actualProducts = products[currentCategory];
            });


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
                    if(cart[item].product.obj_id == product.obj_id) {
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
        }

    })

;