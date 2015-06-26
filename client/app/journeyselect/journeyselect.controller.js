'use strict';

angular.module('formerFunApp')
  .controller('JourneySelectCtrl', function ($log, $scope, $http, $q, $window, former, $mdToast, socket, $localStorage) {

    var formName = 'journey';


    $scope.journeys = undefined;
    $scope.sharedJourneys = undefined;

    $scope.deleteSharedJourney = deleteSharedJourney;
    $scope.deleteJourney = deleteJourney;
    $scope.shareJourney = shareJourney;

    $scope.newFormId = createNewFormId();
    $scope.clearLocalStorage = clearLocalStorage;


    $scope.$on('$destroy', function(){
      socket.unsyncUpdates('journey');
    });

    return init();


    /**
     *
     * @returns {*}
     */
    function init(){
      getSharedJourneys(formName)
        .then(function(){
          socket.syncUpdates('journey', $scope.sharedJourneys, socketUpdate);
        });
      return getLocalJourneys(formName);
    }

    /**
     *
     */
    function socketUpdate(status, sharedJourney){
      $log.debug('socketUpdate', status, sharedJourney);
      addSharedJourney(sharedJourney);
    }


    /**
     *
     * @param sharedJourney
     */
    function addSharedJourney(sharedJourney){

      //TODO should be in former service
      //TODO should be in former service
      //TODO should be in former service
      //TODO should be in former service
      //TODO should be in former service
      //former.addFormData(formName, sharedJourney);

      $localStorage[sharedJourney._formId] = sharedJourney;
    }

    /**
     *
     * @param journey
     */
    function deleteSharedJourney(journey){
      deleteJourney(journey)
        .then(function(){
          $http.delete('/api/journeys/' + journey._id)
            .then(function(response){
              $log.debug('successfully deleted shared journey', response);
            })
        });
    }

    /**
     *
     */
    function deleteJourney(journey){
      $log.debug('deleteJourney', journey);
      return former.deleteForm(formName, journey)
        .then(function(deletedForm){
          getLocalJourneys(formName);

          //TODO add undo function
        });
    }

    /**
     *
     */
    function shareJourney(journey){
      $log.debug('shareJourney', journey);

      var journeyCopy = angular.copy(journey);
      journeyCopy._formId = former.getNewFormId();
      journeyCopy.isShared = true;

      $http.post('/api/journeys', journeyCopy)
        .then(function(response){
          $log.debug('shareJourneyResponse', response.data);
        })
        .catch(function(error){
          $log.debug('shareJourneyError', error);
        });

    }

    /**
     *
     */
    function clearLocalStorage(){
      $window.localStorage.clear();
      $window.location.reload();
    }

    /**
     *
     */
    function createNewFormId(){
      return former.getNewFormId(formName);
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

    /**
     *
     * @param formName
     */
    function getSharedJourneys(){
      return $http.get('/api/journeys')
        .then(function(response){
          $log.debug('getSharedJourneys', response.data);
          $scope.sharedJourneys = response.data;

          _.map($scope.sharedJourneys, function(sharedJourney){
            addSharedJourney(sharedJourney);
          });

          return $q.when(response.data);
        })
        .catch(function(error){
          $log.debug('getSharedJourneys error', error);
        });
    }



  });
