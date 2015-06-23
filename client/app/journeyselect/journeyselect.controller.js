'use strict';

angular.module('formerFunApp')
  .controller('JourneySelectCtrl', function ($log, $scope, $http, $q, $window, former, $state, $stateParams) {

    var formName = 'journey';


    $scope.journeys = undefined;


    return init();


    /**
     *
     * @returns {*}
     */
    function init(){
      return getLocalJourneys(formName);
    }




    /**
     *
     * @param id
     */
    function getLocalJourneys(formName){
      return former.fetchLocalFormData(formName)
        .then(function(forms){
          $scope.journeys = forms;
          $log.debug('getLocalJourneys', $scope.journeys);
          return $scope.journeys;
        })
        .catch(function(error){
          $log.error('Error getting local journey', error);
        });
    }



  });
