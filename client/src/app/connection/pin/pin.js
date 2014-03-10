angular.module('buckutt.connection.pin', [
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'connection.pin', {
            url: '/pin',
            views: {
                "main": {
                    controller: 'PinCtrl',
                    templateUrl: 'app/connection/pin/pin.tpl.html'
                }
            },
            data:{ pageTitle: 'Code PIN' }
        })
    })

    .factory('Sellers', function($resource) {
        return $resource('/api/users/login/id=:id&pwd=:pwd', {id:"", pwd:""});
    })

    .controller('PinCtrl', function PinCtrl($scope, $rootScope, $stateParams, $cookieStore, $state, Sellers) {
        if($rootScope.seller == undefined) $state.transitionTo('connection.status', {error:1});
        if($rootScope.seller && $rootScope.isLogged) $state.transitionTo('sell.waiter');

        var errors = ['','Erreur : Le code PIN est faux.'];
        
        $scope.seller = $rootScope.seller;
        $scope.userPin = '';

        $scope.focusOnInput = function () {
            $("#userPin").focus();
        };

        $scope.changeUserPin = function(value) {
            if(angular.isNumber(value) && $scope.userPin.length < 4) $scope.userPin += value;
            else if(value == "x") $scope.userPin = $scope.userPin.substring(0,$scope.userPin.length-1);
        }

        $scope.sendUserPin = function() {
            logged = Sellers.get({id:$scope.seller.id, pwd: CryptoJS.MD5($scope.userPin)}, function(){
                if(logged.logged) {
                    $rootScope.isLogged = true;
                    $state.transitionTo("sell.waiter");
                } else {
                    $scope.userPin = '';
                    $scope.error = errors[1];
                }
            });
        }

        $scope.focusOnInput();
    });

;