angular.module('buckutt.connection', [
        'ngResource',
        'ngCookies',
        'buckutt.connection.pin',
        'buckutt.connection.status',
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'connection', {
            abstract: true,
            url: '/connection',
            views: {
                "main": {
                    templateUrl: 'app/connection/connection.tpl.html'
                }
            }
        })
    })

;