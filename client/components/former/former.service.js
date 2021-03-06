'use strict';

angular.module('formerFunApp')
  .factory('former', function(formlyConfig, $log, $http, $window, $q, $localStorage) {

    var formCache = {};
    var templateCache = {};
    var transformationCache = {};


    return {
      fetchLocalFormIds: fetchLocalFormIds,
      deleteForm: deleteForm,
      fetchLocalFormData: fetchLocalFormData,
      getNewFormId: getNewFormId,
      addForm: addForm,
      getLocalFormIdsKey: getLocalFormIdsKey,
      trackFormId: trackFormId,
      loadForm: loadForm,
      loadTemplates: loadTemplates
    };


    /**
     *
     * @param formName
     */
    function fetchLocalFormData(formName, formId){

      if(formName && formId){
        var formData = $localStorage[formId];

        if(formData){
          return $q.when(formData);
        }
        else{
          return $q.reject('Not found');
        }
      }
      else if(formName){
        return fetchLocalFormIds(formName)
          .then(function(ids){
            $log.debug('fetchLocalFormData ids', ids);
            return $q.when(_.map(ids, function(id){
              return $localStorage[id];
            }));
          });

      }
      else{
        $log.error('incorrect params passed', formName, formId);
        return $q.reject();
      }

    }


    /**
     *
     * @param formName
     */
    function getNewFormId(formName){
      return '_' + _.random(100000000001, 999999999999);
    }

    /**
     *
     * @param formName
     */
    function fetchLocalFormIds(formName){
      return $q.when($localStorage[getLocalFormIdsKey(formName)] || []);
    }

    /**
     *
     * @param formName
     */
    function getLocalFormIdsKey(formName){
      return 'localFormIds_' + formName;
    }

    /**
     *
     * @param formname
     * @returns {*}
     */
    function loadForm(form){
      if(formCache[form.name]){
        $log.debug('form from cache', formCache[form.name]);
      }
      else {
        formCache[form.name] = configForm(form)
          .catch(function(){
            $log.error('Error getting form data', arguments);
          });
      }

      return formCache[form.name];
    }


    /**
     *
     * @param formData
     */
    function deleteForm(formName, formData){
      var formId = formData;
      if(typeof formData !== 'string'){
        formId = formData._formId;
      }

      var formIds = $localStorage[getLocalFormIdsKey(formName)];
      if(formIds.indexOf(formId) !== -1){
        formIds.splice(formIds.indexOf(formId), 1);
      }

      var deletedFormData = $localStorage[formId];

      $localStorage[formId] = undefined;
      return $q.when(deletedFormData);
    }

    /**
     *
     * @param templates
     * @returns {*}
     */
    function loadTemplates(templates) {
      $log.debug('templates response', templates);

      _(templates).sort(function(a, b){
          var aExtends = a.extends !== undefined;
          var bExtends = b.extends !== undefined;

          if( aExtends === bExtends ){
            return 0;
          }
          return aExtends ? 1 : -1;
        })
        .map(function(template){
          if(! template.name){
            throw new Error('Template without a name', template);
          }

          if( ! templateCache[template.name]){
            templateCache[template.name] = template;
            formlyConfig.setType(template);
          }
        });

      return $q.when(templates);
    }




    /**
     *
     * @param form
     */
    function configForm(form) {
      $log.debug('configForm response', form);

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

      $log.debug('transforming form', transformationModules, transformationModules.isArray);

      if(transformationModules && transformationModules.constructor === Array) {
        var resolveModules = [];

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

      if(typeof transformationCache[module] === 'function'){
        transformationCache[module](form, 'formerFunApp');
        transformationDeferred.resolve(form);
      }
      else {
        $window[module + 'Callback'] = function(transformationFunction){
          try {
            transformationCache[module] = transformationFunction;
            transformationFunction(form, 'formerFunApp');
            $log.debug('Successfully applied transformation', module);
            transformationDeferred.resolve(form);
          }
          catch(error){
            $log.debug('Error applying transformation', error);
            transformationCache[module] = undefined;
            transformationDeferred.reject(error);
          }
        };

        $('body').append( getTransformationScriptElement(form, module) );

      }

      return transformationDeferred.promise;
    }

    /**
     *
     * @param formName
     * @param form
     */
    function addForm(formName, form){
      if( ! form._formId){
        $log.error('adding form with no id', formName, form);
        return $q.reject();
      }

      if(formName && formName._formId){
        $log.error('need to pass formName to add form addForm(formName, form)');
        return $q.reject();
      }

      trackFormId(formName, form._formId);
      $localStorage[form._formId] = form;

      return $q.when(form);
    }


    /**
     *
     * @param formName
     * @param id
     */
    function trackFormId(formName, id){
      var localStorageKey = getLocalFormIdsKey(formName);
      $localStorage[localStorageKey] = $localStorage[localStorageKey] || [];
      if($localStorage[localStorageKey].indexOf(id) === -1){
        $localStorage[localStorageKey].push(id);
      }
    }

    /**
     *
     * @param form
     * @param module
     */
    function getTransformationScriptElement(form, module){
      var transformationScript = document.createElement( 'script' );
      transformationScript.type = 'text/javascript';
      transformationScript.src = getTransformationScriptUrl(form, module);
      return transformationScript;
    }


    /**
     *
     */
    function getTransformationScriptUrl(form, module){
      $log.debug('getTransformationScriptUrl module', module);
      var url = form.transformationModules.baseurl + '/' + module;
      $log.debug('getTransformationScriptUrl', url);
      return url;
    }




  });
