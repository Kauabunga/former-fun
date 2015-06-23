'use strict';

angular.module('formerFunApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'formly',
  'ngStorage',
  'ngMaterial',
  'ngMessages'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });



angular.module('formerFunApp')
  .run(function($log, formlyConfig, $http){



    // TODO move this into a template transformer
    // TODO move this into a template transformer
    // TODO move this into a template transformer :: NOTE template is in index.html
    // TODO move this into a template transformer
    formlyConfig.setType({
      name: 'repeatSection',
      template: '<div class="{{hideRepeat}}">' +
                  '<div class="repeatsection" ng-repeat="element in model[options.key]" ng-init="fields = copyFields(to.fields)">' +
                    '<formly-form fields="fields" model="element" bind-name="\'formly_ng_repeat\' + index + $parent.$index"></formly-form> ' +
                    '<div style="margin-bottom:20px;">' +
                      '<md-button type="button" class="md-accent md-raised" ng-click="model[options.key].splice($index, 1)"> Remove </md-button>' +
                    '</div>' +
                    '<hr>' +
                  '</div>' +
                  '<p class="AddNewButton"> ' +
                    '<md-button type="button" class="md-primary md-raised" ng-click="addNew()" >{{to.btnText}}</md-button>' +
                  '</p>' +
                '</div>',

      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;

        $scope.copyFields = copyFields;

        function copyFields(fields) {
          return angular.copy(fields);
        }

        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }

          repeatsection.push(newsection);
        }
      }
    });

  });
