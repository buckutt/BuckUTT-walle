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

    .factory('Points', ['$resource', function($resource) {
        return $resource('/api/points', {}, {'get':  {method:'GET', isArray:true}});
    }])

    .controller('PointCtrl', function PointCtrl($scope, $rootScope, $state, $cookieStore, Points) {
        if(!$rootScope.isAdmin) $state.transitionTo('connection.status');

        var getPoints = Points.get({}, function () {
            console.log(getPoints);
            $scope.points = getPoints;
        });

        $scope.changePoint = function(pointId) {
            var today = new Date(), expires = new Date();
            expires.setTime(today.getTime() + (365*24*60*60*1000));
            document.cookie = "pointId=" + encodeURIComponent(pointId) + ";expires=" + expires.toGMTString();

            $state.transitionTo('sell.waiter');
        };
    })
;