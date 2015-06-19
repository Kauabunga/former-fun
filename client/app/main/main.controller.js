'use strict';

angular.module('formerFunApp')
  .controller('MainCtrl', function ($log, $scope, $http, $q, $window, former) {

    $scope.formDefinition = undefined;
    $scope.formControls = undefined;

    former.loadForm('acc45')
      .then(function(form){
        $scope.formDefinition = form;
      });

  });
