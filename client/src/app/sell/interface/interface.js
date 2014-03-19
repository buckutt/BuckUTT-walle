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
        return $resource('/api/products/buyer_id=:buyer_id&point_id=:point_id', {seller_id:"", point_id:""}, {'get':  {method:'GET', isArray:true}});
    }])

    .factory('Purchases', function($resource) {
        return $resource('/api/purchases');
    })

    .factory('Promotions', function($resource) {
        return $resource('/api/products/promotion_id=:promotion_id', {promotion_id:""}, {'get':  {method:'GET', isArray:true}});
    })

    .controller('InterfaceCtrl', function InterfaceCtrl($scope, $state, $rootScope, $cookieStore, Products, Purchases, Promotions) {
        if(!$rootScope.isSeller || !$rootScope.isLogged) $state.transitionTo('connection.status', {error:3});
        if(!$rootScope.buyer) $state.transitionTo('sell.waiter', {error:1});
        else {
            var currentCategory = "Accueil";
            $scope.categories = [];
            var rawProducts = [];
            var products = {};
            var promotions = [];
            var nbSteps = [];
            $scope.buyer = $rootScope.buyer;
            $scope.isReloader = $rootScope.isReloader;

            $scope.loadProducts = function () {
                var getProducts = Products.get({buyer_id: $scope.buyer.id, point_id: $cookieStore.get("pointId")}, function () {
                    rawProducts = getProducts;
                    for(var productKey in getProducts) {
                        var product = getProducts[productKey];
                        if(product.category == null) {
                            product.category = "Accueil";
                        }
                        if(!products[product.category] && product.category) {
                            $scope.categories.push({
                                "id": product.category,
                                "name": product.category
                            });
                            products[product.category] = [];
                        }
                        if(product.obj_type == "product") products[product.category].push(product);
                        else if(product.obj_type == "promotion") {
                            var getPromotions = Promotions.get({promotion_id: product.obj_id}, function () {
                                if(getPromotions[0]) {
                                    promotions[getPromotions[0].obj_id_parent] = getPromotions;
                                    var maxPromo = 0;
                                    for(promotion in getPromotions) {
                                        if(getPromotions[promotion].oli_step > maxPromo) maxPromo = getPromotions[promotion].oli_step;
                                        nbSteps[getPromotions[promotion].obj_id_parent] = maxPromo;
                                    }
                                }

                            });
                        }
                    }
                    $scope.switchCategory(currentCategory);
                    $scope.actualProducts = products[currentCategory];
                    $scope.cart = [];
                });
            };

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

            var getProductById = function(id) {
                for(product in rawProducts) {
                    if(rawProducts[product].obj_id == id) {
                        return rawProducts[product];
                    }
                }
            }

            var getLowestLevel = function(product) {
                if(product.obj_id_parent == null) return product;
                else {
                    var parent = getProductById(product.obj_id_parent);
                    return getLowestLevel(parent);
                }
            }

            var isPromotion = function(product, promo) {
                var lowerProduct = getLowestLevel(product);
                var promotion = promotions[promo];
                for(state in promotion) {
                    if(promotion[state].obj_id_child == lowerProduct.obj_id) {
                        return true;
                    }
                }
                return false;
            }

            var getStep = function(product, promo) {
                var lowerProduct = getLowestLevel(product);
                for(step in promotions[promo]) {
                    if(lowerProduct.obj_id == promotions[promo][step].obj_id_child) {
                        return promotions[promo][step].oli_step;
                    }
                }
            }

            $scope.addProduct = function(product) {
                var backupCart = JSON.parse(JSON.stringify($scope.cart));
                var backupCredit = $scope.buyer.credit;

                var isFound = false;
                for(item in $scope.cart) {
                    if($scope.cart[item].product.obj_id == product.obj_id) {
                        $scope.cart[item].quantity++;
                        isFound = true;
                    }
                }
                if(!isFound) {
                    $scope.cart.push({
                        "product":product,
                        "quantity":1
                    });
                }

                $scope.buyer.credit -= product.price;

                var uids = {};
                var promos = {};

                for(promotion in promotions) {
                    if(uids[promotion] == undefined) uids[promotion] = {};
                    if(promos[promotion] == undefined) promos[promotion] = {};
                    for(item in $scope.cart) {
                        for(var i= 1;i<=$scope.cart[item].quantity;i++) {
                            var currentStep = getStep($scope.cart[item].product,promotion);
                            if(uids[promotion][currentStep] == undefined) uids[promotion][currentStep] = 0;
                            if(promos[promotion][uids[promotion][currentStep]] == undefined) promos[promotion][uids[promotion][currentStep]] = {};
                            if(isPromotion($scope.cart[item].product,promotion) && currentStep) {
                                promos[promotion][uids[promotion][currentStep]][currentStep] = $scope.cart[item];
                                uids[promotion][currentStep]++;
                            }
                        }
                    }
                }

                for(promo in promos) {
                    for(uid in promos[promo]) {
                        if(getObjectLength(promos[promo][uid]) == nbSteps[promo]) {
                            var promoItem = {
                                "product":getProductById(promo),
                                "quantity":1,
                                "content":[]
                            };
                            for(step in promos[promo][uid]) {
                                promoItem.content[step-1] = promos[promo][uid][step].product;
                                $scope.deleteProduct(promos[promo][uid][step],1);
                            }

                            $scope.cart.push(promoItem);
                            $scope.buyer.credit -= promoItem.product.price;
                        }
                    }
                }

                if($scope.buyer.credit < 0) {
                    $scope.cart = JSON.parse(JSON.stringify(backupCart));
                    $scope.buyer.credit = backupCredit;
                }

            };

            $scope.deleteProduct = function(item, nbItems) {
                var index = $scope.cart.indexOf(item);
                if(nbItems == 'all') nbItems = $scope.cart[index].quantity;
                if(nbItems <= $scope.cart[index].quantity) {
                    $scope.buyer.credit += item.product.price*nbItems;
                    if(nbItems == $scope.cart[index].quantity) {
                        if(index > -1) {
                            $scope.cart.splice(index,1);
                        }
                    } else {
                        $scope.cart[index].quantity -= nbItems;
                    }
                }
            };

            $scope.sendPurchases = function() {
                if($scope.cart.length > 0) {
                    var params = {};
                    params.buyer_id = $scope.buyer.id;
                    params.seller_id = $rootScope.seller.id;
                    params.point_id = $cookieStore.get("pointId");
                    params.products = $scope.cart;
                    Purchases.save({}, params);

                    $rootScope.lastBuyer = $scope.buyer;
                }
                $scope.finish();
            }

            $scope.finish = function() {
                $rootScope.buyer = undefined;
                $state.transitionTo("sell.waiter");
            };

            $scope.toReload = function() {
                $state.transitionTo("reload");
            }

            var getObjectLength = function(object) {
                var count = 0;
                for(i in object) {
                    count++;
                }
                return count;
            }

            setTimeout($scope.loadProducts,100);
        }

    })

;