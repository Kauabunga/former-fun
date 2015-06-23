'use strict';

angular.module('formerFunApp')
  .controller('JourneyViewCtrl', function ($log, $scope, $http, $q, $window, former, $state, $stateParams) {

    var formName = 'journey';

    $scope.journeyDefinition = undefined;

    $scope.gotoEditor = gotoEditor;

    return init();


    /**
     *
     * @returns {*}
     */
    function init(){
      if( ! $stateParams.currentId ){
        return gotoEditor();
      }
      else {
        return getLocalJourney(formName, $stateParams.currentId);
      }
    }


    /**
     *
     * @param id
     */
    function getLocalJourney(formName, id){
      return former.fetchLocalFormData(formName, id)
        .then(function(formData){
          $scope.journeyDefinition = formData;
          $log.debug('getLocalJourney', $scope.journeyDefinition);
          return $scope.journeyDefinition;
        })
        .catch(function(error){
          $log.error('Error getting local journey', error);
          return gotoEditor();
        });
    }

    /**
     *
     */
    function gotoEditor(){

      console.log('gotoEditor', $stateParams);

      //TODO this is a bug? why is this not redirecting to the default section....
      $stateParams.currentSection = 'start';

      return $state.go('journeyedit', $stateParams, { reload: true });
    }



  });
