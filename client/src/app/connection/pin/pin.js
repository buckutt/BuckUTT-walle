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

    .controller('PinCtrl', function PinCtrl($scope, $rootScope, $stateParams, $cookieStore, $state, Users) {

        $scope.focusOnInput = function () {
            $("#sellerPin").focus();
        };
    });

;