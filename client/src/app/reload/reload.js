angular.module('buckutt.reload', [
        'ngResource',
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'reload', {
            url: '/reload',
            views: {
                "main": {
                    controller: 'ReloadCtrl',
                    templateUrl: 'app/reload/reload.tpl.html'
                }
            },
            data:{ pageTitle: 'Rechargement' }
        })
    })

    .factory('Types', ['$resource', function($resource) {
        return $resource('/api/reload/types', {}, {'get':  {method:'GET', isArray:true}});
    }])

    .factory('Reloader', function($resource) {
        return $resource('/api/reload');
    })


    .controller('ReloadCtrl', function ReloadCtrl($scope, $rootScope, $stateParams, $state, $cookieStore, Types, Reloader) {
        if($rootScope.seller == undefined) $state.transitionTo('connection.status', {error:1});
        if(!$rootScope.isReloader || !$rootScope.buyer) $state.transitionTo('sell.waiter');

        $scope.seller = $rootScope.seller;
        $scope.credit = 0;
        var chosenType = 1;

        var getTypes = Types.get({}, function () {
            $scope.types = getTypes;
        });

        $scope.focusOnInput = function () {
            $("#credit").focus();
        };

        $scope.changeUserPin = function(value) {
            if(angular.isNumber(value) && $scope.userPin.length < 4) $scope.userPin += value;
            else if(value == "x") $scope.userPin = $scope.userPin.substring(0,$scope.userPin.length-1);
        }

        $scope.currentType = function() {
            for(type in $scope.types) {
                if(chosenType == $scope.types[type].rty_id) return $scope.types[type].rty_name;
            }
            return false;
        }

        $scope.logout = function() {
            $state.transitionTo("sell.interface");
        };

        $scope.setType = function(type) {
            chosenType = type.rty_id;
        }

        $scope.isActive = function(type) {
            if (type.rty_id == chosenType) {
                return true;
            }
            return false;
        };

        $scope.changeCredit = function(value) {
            var backupCredit = $scope.credit;
            if(value == 'x') {
                $scope.credit *= 100;
                var modulo = $scope.credit % 10;
                $scope.credit -= modulo;
                $scope.credit /= 1000;
            }
            else {
                $scope.credit *= 10*100;
                $scope.credit += value;
                $scope.credit /= 100;
            }
            $scope.credit = $scope.credit.toFixed(2);

            if($rootScope.realCredit+$scope.credit*100 > 10000) {
                $scope.credit = backupCredit;
            }
        }

        $scope.valid = function() {
            $scope.isValided = true;
        }

        $scope.confirm = function() {
            if($rootScope.realCredit+$scope.credit*100 <= 10000) {
                var params = {};
                params.buyer_id = $rootScope.buyer.id;
                params.seller_id = $rootScope.seller.id;
                params.reload_type = chosenType;
                params.point_id = $cookieStore.get("pointId");
                params.credit = $scope.credit*100;
                var rel = Reloader.save({}, params, function() {
                    if(rel.error) {
                        $rootScope.buyer = null;
                        $state.transitionTo('sell.waiter', {error: 3});
                    } else {

                        $rootScope.buyer.credit += $scope.credit*100;

                        $state.transitionTo("sell.interface");
                    }
                });
            } else {
                $scope.message_error = 'Le total dépasse 100€';
            }
        }

        $scope.focusOnInput();
    });

;