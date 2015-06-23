'use strict';

angular.module('formerFunApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/journeyview', '/journeyedit/');
    $urlRouterProvider.when('/journeyview/', '/journeyedit/');

    $stateProvider
      .state('journeyview', {
        url: '/journeyview/:currentId',
        templateUrl: 'app/journeyview/journeyview.html',
        controller: 'JourneyViewCtrl'
      });
  });
