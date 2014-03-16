angular.module('buckutt.sell.waiter', [
        'buckutt.sell.interface',
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'sell.waiter', {
            url: '/waiter?error',
            views: {
                "main": {
                    controller: 'WaiterCtrl',
                    templateUrl: 'app/sell/waiter/waiter.tpl.html'
                }
            },
            data:{ pageTitle: 'Waiter' }
        })
    })

    .factory('Users', function($resource) {
        return $resource('/api/users/data=:data&meanOfLogin=:mol&point_id=:point_id', {data: "", mol: "", point_id: ""});
    })

    .controller('WaiterCtrl', function WaiterCtrl($scope, $rootScope, $state, $stateParams, $cookieStore, Users) {
        if(!$rootScope.isSeller || !$rootScope.isLogged) $state.transitionTo('connection.status', {error:3});
        $("#cardId").focus();
        var seller = undefined;
        var errors = ['','Erreur : L\'utilisateur n\'existe pas.'];

        $scope.pressEnter = function() {
            buyer = Users.get({data: $scope.cardId, mol: "4", point_id: $cookieStore.get("pointId")}, function(){
                if(buyer.error == "No entry") displayError(1);
                else {
                    $rootScope.buyer = buyer;
                    $state.transitionTo("sell.interface");
                }
                $scope.cardId = '';
            });
        };

        $scope.focusOnInput = function () {
            $("#cardId").focus();
        };

        displayError = function (error) {
            if(error != undefined) $scope.error = errors[parseInt(error)];
        };

        displayError($stateParams.error);
        $scope.focusOnInput();
    })

;