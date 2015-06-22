'use strict';

angular.module('formerFunApp')
  .controller('MainCtrl', function ($log, $scope, $http, $q, $window, former, $state, $stateParams) {

    var formName = 'acc45';
    var formBaseurl = '/api/forms/';
    var templatesBaseurl = '/api/templates/';

    $scope.formDefinition = undefined;
    $scope.formControls = undefined;
    $scope.previousForms = undefined;

    $scope.selectPreviousForm = selectPreviousForm;


    return init();


    /**
     *
     * @returns {*}
     */
    function init(){

      former.fetchLocalFormIds(formName)
        .then(function(forms){
          $scope.previousForms = forms;
        });

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
