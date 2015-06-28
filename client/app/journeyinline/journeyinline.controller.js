'use strict';

angular.module('formerFunApp')
  .controller('JourneyInlineViewCtrl', function ($log, $scope, $http, $q, $window, former, $state, $stateParams,PanZoomService, $timeout, socket) {


    var viewFormName = 'journeyinline';
    var formBaseurl = '/api/forms/';
    var templatesBaseurl = '/api/templates/';


    $scope.journeyDefinition = undefined;
    $scope.currentId = $stateParams.currentId;
    $scope.fadeIn = false;
    $scope.journey = undefined;

    $scope.disableWatcher = undefined;

    $scope.gotoEditor = gotoEditor;
    $scope.model = {};

    var initial = {
      x:50,
      y:50
    };

    $scope.config = {
      zoomLevels: 1,
      neutralZoomLevel: 1,
      initialZoomLevel: 1,
      zoomOnDoubleClick: false,
      zoomOnMouseWheel: false
    };



    $timeout(function(){
      $scope.panStyle = 'height:' + $window.screen.height + 'px;width:' + $window.screen.width+'px';
      PanZoomService.getAPI('PanZoom').then(function(api) {
        api.zoomToFit(initial);
      });
    });




    $scope.$on('$destroy', function(){
      socket.socket.removeListener('journey:updated', socketUpdate);
    });


    return init();


    /**
     *
     * @returns {*}
     */
    function init(){

      var sendSocketUpdateThrottle = _.debounce(sendSocketUpdate, 500, false);

      var journeyWatcher = $scope.$watch('journey', function(){
        $log.debug('journeyWatcher', $scope.journey);

        if($scope.journey && $scope.journey._formId){
          if(! $scope.journey.isShared){
            return journeyWatcher();
          }
          else {
            if($scope.disableWatcher === undefined){
              socket.socket.on('journey:updated', socketUpdate);
              $scope.disableWatcher = false;
            }
            else if($scope.disableWatcher === false){
              sendSocketUpdateThrottle();
            }
          }
        }
      }, true);



      var resolves = [fetchTemplates(), fetchForm(viewFormName)];

      $q.all(resolves)
        .then(function(definitions){
          var templates = definitions[0];
          var form = definitions[1];

          former.loadTemplates(templates)
            .then(function(){
              return former.loadForm(form);
            })
            .then(function(formDefinition){
              $scope.formDefinition = formDefinition;

              //rejigging name here so it matches with all our other ids
              //TODO should really have a form.type
              $scope.formDefinition.name = 'journey';

              $timeout(function(){
                $scope.fadeIn = true;
              });
            });

        });


      //return fetchTemplates()
      //  .then(function(templates){
      //    return former.loadTemplates(templates);
      //  })
      //  .then(function(){
      //    return fetchForm(viewFormName);
      //  })
      //  .then(function(formComplete){
      //    return former.loadForm(formComplete);
      //  })
      //  .then(function(formDefinition){
      //    $scope.formDefinition = formDefinition;
      //
      //    //rejigging name here so it matches with all our other ids
      //    //TODO should really have a form.type
      //    //TODO should really have a form.type
      //    //TODO should really have a form.type
      //    //TODO should really have a form.type
      //    $scope.formDefinition.name = 'journey';
      //
      //    $timeout(function(){
      //      $scope.fadeIn = true;
      //    });
      //  });
    }


    /**
     *
     * @param journey
     */
    function sendSocketUpdate(){
      $log.debug('sending update');
      socket.socket.emit('journey:update', $scope.journey);
    }

    /**
     *
     */
    function socketUpdate(journey){

      $log.debug('socketUpdate', journey);

      if(journey && journey.isShared && journey._formId &&
        journey._formId === $scope.journey._formId && ! $scope.disableWatcher){

        $scope.disableWatcher = true;
        _.merge($scope.journey, journey, true);
        $scope.journeyTitle = journey.title;

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
