angular.module('buckutt.sell.calculator', [
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'sell.calculator', {
            url: '/calculator',
            views: {
                "main": {
                    controller: 'CalculatorCtrl',
                    templateUrl: 'app/sell/calculator/calculator.tpl.html'
                }
            },
            data:{ pageTitle: 'Calculatrice' }
        })
    })

    .controller('CalculatorCtrl', function CalculatorCtrl($scope) {
        $scope.test = 'test1';
    })

;