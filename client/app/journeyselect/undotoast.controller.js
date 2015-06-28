'use strict';

angular.module('formerFunApp')
  .controller('UndoToastCtrl', function ($log, $scope, $http, $q, $window, former, $mdToast, socket, $localStorage, $rootScope) {


    $scope.dismissToast = dismissToast;
    $scope.undoDelete = undoDelete;

    var stateChangeHandleDestroy = $rootScope.$on('$stateChangeStart', handleStateChange);
    $scope.$on('$destroy', function(){
      stateChangeHandleDestroy();
    });

    /**
     *
     */
    function undoDelete(){
      $mdToast.hide(true);
    }

    /**
     *
     */
    function dismissToast(){
      $mdToast.hide(false);
    }

    function handleStateChange(){
      $mdToast.hide(false);
    }

  });
