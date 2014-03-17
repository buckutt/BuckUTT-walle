angular.module('buckutt.admin', [
        'ngCookies',
        'ngResource',
        'buckutt.admin.point',
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'admin', {
            abstract: true,
            url: '/admin',
            views: {
                "main": {
                    templateUrl: 'app/admin/admin.tpl.html'
                }
            }
        })
    })

;