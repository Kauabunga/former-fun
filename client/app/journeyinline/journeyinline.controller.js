'use strict';

angular.module('formerFunApp')
  .controller('JourneyInlineViewCtrl', function ($log, $scope, $http, $q, $window, former, $state, $stateParams) {


    var viewFormName = 'journeyinline';
    var formBaseurl = '/api/forms/';
    var templatesBaseurl = '/api/templates/';


    $scope.journeyDefinition = undefined;
    $scope.currentId = $stateParams.currentId;

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
          });


      }
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
