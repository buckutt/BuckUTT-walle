angular.module('buckutt.admin.point', [
        'ngCookies',
        'ngResource',
        'ui.router'
    ])

    .config(function config($stateProvider) {
        $stateProvider.state( 'admin.point', {
            url: '/point',
            views: {
                "main": {
                    controller: 'PointCtrl',
                    templateUrl: 'app/admin/point/point.tpl.html'
                }
            },
            data:{ pageTitle: 'Admin point' }
        })
    })

    .controller('PointCtrl', function PointCtrl($scope, $rootScope, $state, $cookieStore) {
        if(!$rootScope.isAdmin) $state.transitionTo('connection.status');
    })

;