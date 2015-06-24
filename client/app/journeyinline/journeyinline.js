'use strict';

angular.module('formerFunApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/journeyinline', '/journeyinline//');
    $urlRouterProvider.when('/journeyinline/', '/journeyinline//');

    $stateProvider
      .state('journeyinline', {
        url: '/journeyinline/:currentSection/:currentId',
        templateUrl: 'app/journeyinline/journeyinline.html',
        controller: 'JourneyInlineViewCtrl'
      });
  });
