'use strict';

angular.module('formerFunApp')
  .controller('MainCtrl', function ($log, $scope, $http, $q, $window, former) {

    var formName = 'acc45';
    var formBaseurl = '/api/forms/';
    var templatesBaseurl = '/api/templates/';

    $scope.formDefinition = undefined;
    $scope.formControls = undefined;


    return init();


    /**
     *
     * @returns {*}
     */
    function init(){

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


  });
