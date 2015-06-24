'use strict';

angular.module('formerFunApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/journeyview', '/journeyview/');
    $urlRouterProvider.when('/journeyview/', '/journeyview/');

    $stateProvider
      .state('journeyview', {
        url: '/journeyview/:currentId',
        templateUrl: 'app/journeyview/journeyview.html',
        controller: 'JourneyViewCtrl'
      });
  });
