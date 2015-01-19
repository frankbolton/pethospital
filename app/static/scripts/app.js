'use strict';

angular.module('ktz', ['ngRoute', 'angular-gestures'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider',
	     function ($routeProvider, $locationProvider, $httpProvider) {

		 delete $httpProvider.defaults.headers.common['X-Requested-With'];
		 $routeProvider
		     .when('/', {templateUrl:'static/views/desktop.html',controller: 'DesktopCtrl'})
		     .when('/mobile', {templateUrl:'static/views/mobile.html',controller: 'MobileCtrl'})
		     .otherwise({redirectTo: '/'});
  }])

.directive('compile', function($compile){
    return function(scope, element, attrs){
      scope.$watch(
        function(scope){return scope.$eval(attrs.compile);},
        function(value){element.html(value);$compile(element.contents())(scope);}
      );
    };
});
