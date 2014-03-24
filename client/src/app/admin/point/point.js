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
            $scope.points = getPoints;
        });

        $scope.changePoint = function(pointId) {
            var today = new Date(), expires = new Date();
            expires.setTime(today.getTime() + (365*24*60*60*1000));
            document.cookie = "pointId=" + encodeURIComponent(pointId) + ";expires=" + expires.toGMTString();

            var seller = $rootScope.seller;
            $rootScope.isSeller = false;
            $rootScope.isReloader = false;
            for(var key in seller.rights) {
                if(seller.rights[key].poi_id == pointId && seller.rights[key].rig_id == 11) $rootScope.isSeller = true;
                else if(seller.rights[key].poi_id == pointId && seller.rights[key].rig_id == 4) $rootScope.isReloader = true;
            }
            
            $rootScope.pointId = pointId;
            $state.transitionTo('sell.waiter');
        };

        $scope.finish = function() {
            $state.transitionTo("sell.waiter");
        };
    })
;