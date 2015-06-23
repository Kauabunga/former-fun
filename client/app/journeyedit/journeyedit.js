'use strict';

angular.module('formerFunApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/journeyedit/', '/journeyedit//');
    $urlRouterProvider.when('/journeyedit', '/journeyedit//');

    $stateProvider
      .state('journeyedit', {
        url: '/journeyedit/:currentSection/:currentId',
        templateUrl: 'app/journeyedit/journeyedit.html',
        controller: 'JourneyEditCtrl'
      });
  });
