'use strict';

angular.module('formerFunApp')
  .controller('MainCtrl', function ($log, $scope, $http, formlyConfig) {

    $scope.formDefinition = undefined;
    $scope.formControls = undefined;

    return fetchTemplates()
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
      $log.debug('configForm response', form);

      //TODO transformation function (optionally) from module?

      $scope.formDefinition = form;
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





  });
