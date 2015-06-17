'use strict';

angular.module('formerFunApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'formly',
  'ngMaterial',
  'ngMessages'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });



angular.module('formerFunApp')
  .run(function($log, formlyConfig, $http){




  });
