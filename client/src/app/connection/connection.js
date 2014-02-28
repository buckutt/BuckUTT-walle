angular.module('buckutt.connection', [
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'connection', {
            url: '/connection',
            views: {
                "main": {
                    controller: 'ConnectionCtrl',
                    templateUrl: 'app/connection/connection.tpl.html'
                }
            },
            data:{ pageTitle: 'Connexion' }
        })
    })

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

    .controller('ConnectionCtrl', function ConnectionCtrl($scope) {
        $("#cardId").focus();

        var cardId = 0;
        $scope.pressEnter = function() {
            cardId = $scope.cardId;
            $scope.cardId = '';
        };
    })

;