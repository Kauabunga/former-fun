'use strict';

angular.module('formerFunApp')
  .controller('MainCtrl', function ($log, $scope, $http, socket, formlyConfig) {


    $scope.formDefinition = undefined;
    $scope.formControls = undefined;


    fetchTemplates()
      .then(configTemplates)
      .then(fetchForm)
      .then(configForm)
      .catch(function(){
        $log.error('Error getting form data', arguments);
      });


    /**
     *
     * @param form
     */
    function configForm(form) {
      $log.debug('form response', form);
      $scope.formDefinition = form;
    }


    /**
     *
     * @returns {*}
     */
    function fetchForm() {
      return $http.get('/api/forms')
        .then(function(response){
          return response.data[0];
        });
    }

    /**
     *
     * @returns {*}
     */
    function fetchTemplates() {
      return $http.get('/api/templates')
        .then(function(response){
          return response.data;
        });
    }

    /**
     *
     * @param templates
     * @returns {*}
     */
    function configTemplates(templates) {
      $log.debug('templates response', templates);
      return formlyConfig.setType(templates);
    }




  });
