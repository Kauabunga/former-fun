'use strict';

angular.module('formerFunApp')
  .controller('JourneySelectCtrl', function ($log, $scope, $http, $q, $window, former, $mdToast, socket, $localStorage, $timeout) {

    var formName = 'journey';


    $scope.journeys = undefined;
    $scope.sharedJourneys = undefined;

    $scope.deleteSharedJourney = deleteSharedJourney;
    $scope.deleteJourney = deleteJourney;
    $scope.shareJourney = shareJourney;
    $scope.copyJourney = copyJourney;

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
      getSharedJourneys(formName, true)
        .then(function(){
          getSharedJourneys(formName, false)
            .then(function(){
              socket.syncUpdates('journey', $scope.sharedJourneys, socketUpdate);

            });
        });

      $timeout(function(){
        $scope.fadeIn = true;
      }, 100);

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
      former.addForm(formName, sharedJourney)
        .catch(function(){
          $log.error('error adding form', arguments);
        });
    }

    /**
     *
     * @param journey
     */
    function deleteSharedJourney(journey){
      deleteJourney(journey)
        .then(function(deletedForm){
          $http.delete('/api/journeys/' + journey._id)
            .then(function(response){
              $log.debug('successfully deleted shared journey', response);
            });
        });
    }

    /**
     *
     * @param journey
     */
    function copyJourney(journey){

      $log.debug('copy journey', journey);

      var journeyCopy = angular.copy(journey);

      journeyCopy.isShared = false;
      journeyCopy._id = undefined;
      journeyCopy.__v = undefined;
      journeyCopy._formId = createNewFormId();

      $log.debug('copied journey', journeyCopy);

      return former.addForm(formName, journeyCopy)
        .then(function(){
          getLocalJourneys(formName);
        });
    }

    /**
     *
     * @param deletedJourney
     * @returns {*}
     */
    function showUndoDeleteToast(deletedJourney) {

      return $mdToast.show({
        controller: 'UndoToastCtrl',
        templateUrl: 'app/journeyselect/undotoast.html',
        hideDelay: 0,
        position: 'top right'
      });

    }

    /**
     *
     */
    function deleteJourney(journey){
      $log.debug('deleteJourney', journey);
      return former.deleteForm(formName, journey)
        .then(function(deletedJourney){

          getLocalJourneys(formName);

          showUndoDeleteToast(deletedJourney)
            .then(function(shouldUndo){
              if(shouldUndo){
                if(deletedJourney.isShared){
                  shareJourney(deletedJourney);
                }
                else {
                  former.addForm(formName, deletedJourney)
                    .then(function(){
                      getLocalJourneys(formName);
                    })
                    .catch(function(){
                      $log.error('error adding form', arguments);
                    });
                }
              }
            });

          return deleteJourney;
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
          var localJourneys = _.filter(forms, function(journey){
            return journey && ! journey.isShared;
          });
          $scope.journeys = localJourneys;
          $log.debug('getLocalJourneys', localJourneys);
          return localJourneys;
        })
        .catch(function(error){
          $log.error('Error getting local journey', error);
        });
    }

    /**
     *
     * @param formName
     */
    function getSharedJourneys(formName, cached){
      return $http({method: 'GET', cache: cached || false, url: '/api/journeys'})
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
