'use strict';

angular.module('formerFunApp')
  .controller('JourneyEditCtrl', function ($log, $scope, $http, $q, $window, former, $state, $stateParams, $timeout) {

    var formName = 'journey';
    var formBaseurl = '/api/forms/';
    var templatesBaseurl = '/api/templates/';

    $scope.formDefinition = undefined;
    $scope.formControls = undefined;
    $scope.previousForms = undefined;
    $scope.fadeIn = false;

    $scope.submitForm = submitForm;
    $scope.selectPreviousForm = selectPreviousForm;


    return init();


    /**
     *
     * @returns {*}
     */
    function init(){

      fetchExistingFormIds();

      return fetchTemplates()
        .then(function(templates){
          return former.loadTemplates(templates);
        })
        .then(function(){
          return fetchForm(formName);
        })
        .then(function(formComplete){
          return former.loadForm(formComplete);
        })
        .then(function(formDefinition){
          $scope.formDefinition = formDefinition;
          $timeout(function(){
            $scope.fadeIn = true;
          }, 100);
        });
    }


    /**
     *
     * @param data
     */
    function submitForm(data){
      $log.debug('submitForm in main controller', data);

    }


    /**
     *
     */
    function fetchExistingFormIds(){
      former.fetchLocalFormIds(formName)
        .then(function(forms){
          $scope.previousForms = forms;
        });
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


    /**
     *
     * @param previousForm
     */
    function selectPreviousForm(previousForm){
      $stateParams.currentId = previousForm;
      reloadPage();
    }


    /**
     *
     */
    function reloadPage(){
      $state.go($state.current.name, $stateParams, { reload: true });
    }




  });
