angular.module('buckutt.connection.status', [
        'buckutt.connection.pin',
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'connection.status', {
            url: '/status?error',
            views: {
                "main": {
                    controller: 'StatusCtrl',
                    templateUrl: 'app/connection/status/status.tpl.html'
                }
            },
            data:{ pageTitle: 'Status' }
        })
    })

    .factory('Users', function($resource) {
        return $resource('/api/users/data=:data&meanOfLogin=:mol&point_id=:point_id', {data: "", mol: "", point_id: ""});
    })

    .controller('StatusCtrl', function StatusCtrl($scope, $rootScope, $state, $stateParams, $cookieStore, Users) {
        if($rootScope.seller && $rootScope.isLogged) $state.transitionTo('sell.waiter');
        $cookieStore.put("pointId",3);
        $("#cardId").focus();
        var seller = undefined;
        var errors = ['','Erreur : L\'utilisateur n\'existe pas.','Erreur : Pas d\'accès vendeur pour ce point.', 'Erreur : Pas de vendeur connecté.'];

        $scope.pressEnter = function() {
            seller = Users.get({data: $scope.cardId, mol: "4", point_id: $cookieStore.get("pointId")}, function(){
                if(seller.error) displayError(1);
                else {
                    $rootScope.isSeller = false;
                    $rootScope.isAdmin = false;
                    $rootScope.isReloader = false;
                    $rootScope.isLogged = false;
                    $rootScope.seller = seller;

                    for(var key in seller.rights) {
                        if(seller.rights[key].poi_id == $cookieStore.get("pointId") && seller.rights[key].rig_id == 11) $rootScope.isSeller = true;
                        else if(seller.rights[key].poi_id == $cookieStore.get("pointId") && seller.rights[key].rig_id == 4) $rootScope.isReloader = true;
                        else if(seller.rights[key].rig_id == 9) $rootScope.isAdmin = true;
                    }

                    if(!$rootScope.isAdmin && !$rootScope.isReloader && !$rootScope.isSeller) displayError(2);
                    else {
                        $state.transitionTo("connection.pin");
                    }
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