angular.module('buckutt.sell', [
        'ngResource',
        'buckutt.sell.interface',
        'buckutt.sell.waiter',
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'sell', {
            abstract: true,
            url: '/sell',
            views: {
                "main": {
                    templateUrl: 'app/sell/sell.tpl.html'
                }
            }
        })
    })

;