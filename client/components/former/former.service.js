'use strict';

angular.module('formerFunApp')
  .factory('former', function(formlyConfig, $log, $http, $window, $q) {

    var formCache = {};

    return {
      loadForm: loadForm
    };

    /**
     *
     * @param formname
     * @returns {*}
     */
    function loadForm(formname){
      if(formCache[formname]){
        $log.debug('form from cache', formCache[formname]);
        return formCache[formname];
      }
      else{
        return formCache[formname] = fetchTemplates()
          .then(loadTemplates)
          .then(function(){
            return fetchForm(formname);
          })
          .then(configForm)
          .catch(function(){
            $log.error('Error getting form data', arguments);
          });
      }

    }



    /**
     *
     * @param form
     */
    function configForm(form) {
      $log.debug('configForm response', form);
      //TODO transformation function (optionally) from module?
      //TODO    Better exposed as config service
      if(form.transformationModules && form.transformationModules.modules){
        return transformForm(form, form.transformationModules.modules);
      }
      else {
        return form;
      }
    }

    /**
     *
     * @param form
     */
    function transformForm(form, transformationModules){

      $log.debug('transforming form', transformationModules);

      if(transformationModules && transformationModules.isArray) {
        let resolveModules = [];

        transformationModules.map(function(module) {
          resolveModules.push(applyTransformation(form, module));
        });

        return $q.all(resolveModules).then(function(){
          return form;
        });

      }
      else {
        return applyTransformation(form, transformationModules);
      }
    }

    /**
     *
     * @param form
     * @param module
     */
    function applyTransformation(form, module){
      //append script to body with callback

      var transformationDeferred = $q.defer();
      $log.debug('Loading and Appling transformation', module);


      $window[module + 'Callback'] = function(transformationFunction){
        try {
          transformationFunction(form);
          $log.debug('Successfully applied transformation', module);
          transformationDeferred.resolve(form);
        }
        catch(error){
          $log.debug('Error applying transformation', error);
          transformationDeferred.reject(error);
        }
      };

      var transformationScript = document.createElement( 'script' );
      transformationScript.type = 'text/javascript';
      transformationScript.src = getTransformationScriptUrl(form, module);
      $('body').append( transformationScript );

      return transformationDeferred.promise;
    }


    /**
     *
     */
    function getTransformationScriptUrl(form, module){
      var url = form.transformationModules.baseurl + '/' + module;
      $log.debug('getTransformationScriptUrl', url);
      return url;
    }


    /**
     *
     * @param templates
     * @returns {*}
     */
    function loadTemplates(templates) {
      $log.debug('templates response', templates);
      return formlyConfig.setType(templates);
    }


    /**
     *
     * @returns {*}
     */
    function fetchForm(formname) {
      return $http.get('/api/forms/' + formname)
        .then(function(response){
          return response.data;
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
