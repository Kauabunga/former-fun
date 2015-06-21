'use strict';

angular.module('formerFunApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/', '/main/');
    $urlRouterProvider.when('/main/', '/main//');
    $urlRouterProvider.when('/main', '/main//');


    $stateProvider
      .state('main', {
        url: '/main/:currentSection/:currentId',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });


  });
