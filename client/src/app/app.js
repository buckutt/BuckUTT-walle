angular.module('buckutt', [
  'ui.router',
  'ngResource',
  'ngCookies',
  'buckutt.sell',
  'buckutt.connection',
  'buckutt.admin',
  'buckutt.reload'
])

.config(function myAppConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('connection/status');
})

.run(function run () {
})


.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

.controller('AppCtrl', function AppCtrl($scope, $location, $rootScope) {
        $(document).mousedown(function(){return false;});
        $rootScope.lol = 0;
})

;

