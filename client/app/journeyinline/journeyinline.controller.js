'use strict';

angular.module('formerFunApp')
  .controller('JourneyInlineViewCtrl', function ($log, $scope, $http, $q, $window, former, $state, $stateParams, $timeout, socket) {


    var viewFormName = 'journeyinline';
    var formBaseurl = '/api/forms/';
    var templatesBaseurl = '/api/templates/';


    $scope.journeyDefinition = undefined;
    $scope.currentId = $stateParams.currentId;
    $scope.fadeIn = false;
    $scope.journey = undefined;

    $scope.disableWatcher = false;

    $scope.gotoEditor = gotoEditor;


    return init();


    /**
     *
     * @returns {*}
     */
    function init(){

      var journeyWatcher = $scope.$watch('journey', function(){

        if($scope.journey && $scope.journey._formId && ! $scope.journey.isShared){
          return journeyWatcher();
        }

        if($scope.journey && $scope.journey._formId &&
          $scope.journey.isShared && ! $scope.disableWatcher){

          sendSocketUpdate();
        }
      }, true);


      socket.socket.on('journey:updated', socketUpdate);



      return fetchTemplates()
        .then(function(templates){
          return former.loadTemplates(templates);
        })
        .then(function(){
          return fetchForm(viewFormName);
        })
        .then(function(formComplete){
          return former.loadForm(formComplete);
        })
        .then(function(formDefinition){
          $scope.formDefinition = formDefinition;

          $timeout(function(){
            $scope.fadeIn = true;
          });
        });
    }


    /**
     *
     * @param journey
     */
    function sendSocketUpdate(){
      $log.debug('sending update');

      var journeyUpdate = _.merge({_updateId: former.getNewFormId()}, $scope.journey);
      socket.socket.emit('journey:update', journeyUpdate);
    }

    /**
     *
     */
    function socketUpdate(journey){

      $log.debug('socketUpdate', journey);

      if(journey && journey.isShared && journey._formId &&
        journey._formId === $scope.journey._formId){

        $scope.disableWatcher = true;
        _.merge($scope.journey, journey, true);

        $timeout(function(){
          $scope.disableWatcher = false;
        });
      }
    }


    /**
     *
     */
    function gotoEditor(){
      console.log('gotoEditor', $stateParams);

      return $state.go('journeyedit', $stateParams, { reload: true });
    }


    /**
     *
     * @returns {*}
     */
    function fetchForm(formname) {
      return $http({
        url: formBaseurl + formname,
        method: 'GET',
        cache: true
      })
        .then(function(response){
          return response.data;
        });
    }

    /**
     *
     * @returns {*}
     */
    function fetchTemplates() {
      return $http({
        url: templatesBaseurl,
        method: 'GET',
        cache: true
      })
        .then(function(response){
          return response.data;
        });
    }


  });
