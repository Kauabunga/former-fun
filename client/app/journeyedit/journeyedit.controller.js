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
    $scope.currentId = $stateParams.currentId;

    $scope.submitForm = submitForm;
    $scope.selectPreviousForm = selectPreviousForm;


    return init();


    /**
     *
     * @returns {*}
     */
    function init(){

      fetchExistingFormIds();


      var resolves = [fetchTemplates(), fetchForm(formName)];

      return $q.all(resolves)
        .then(function(definitions){
          var templates = definitions[0];
          var form = definitions[1];

          return former.loadTemplates(templates)
            .then(function(){
              return former.loadForm(form);
            })
            .then(function(formDefinition){
              $scope.formDefinition = formDefinition;
              $timeout(function(){
                $scope.fadeIn = true;
              });
            });
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
