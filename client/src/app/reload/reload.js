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

    .controller('ReloadCtrl', function ReloadCtrl($scope, $rootScope, $stateParams, $state, Types) {
        if($rootScope.seller == undefined) $state.transitionTo('connection.status', {error:1});
        if(!$rootScope.isReloader || !$rootScope.buyer) $state.transitionTo('sell.waiter');

        $scope.seller = $rootScope.seller;
        $scope.credit = '';
        var chosenType = 1;

        var getTypes = Types.get({}, function () {
            $scope.types = getTypes;
        });

        $scope.focusOnInput = function () {
            $("#userPin").focus();
        };

        $scope.changeUserPin = function(value) {
            if(angular.isNumber(value) && $scope.userPin.length < 4) $scope.userPin += value;
            else if(value == "x") $scope.userPin = $scope.userPin.substring(0,$scope.userPin.length-1);
        }

        $scope.logout = function() {
            $state.transitionTo("sell.waiter");
        };

        $scope.setType = function(type) {
            chosenType = type.rty_id;
        }

        $scope.isActive = function(type) {
            if (type == chosenType) {
                return true;
            }
            return false;
        };

        $scope.focusOnInput();
    });

;