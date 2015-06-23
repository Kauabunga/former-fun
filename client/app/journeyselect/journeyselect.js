'use strict';

angular.module('formerFunApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/', '/journeyselect');

    $stateProvider
      .state('journeyselect', {
        url: '/journeyselect',
        templateUrl: 'app/journeyselect/journeyselect.html',
        controller: 'JourneySelectCtrl'
      });
  });
