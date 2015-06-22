
/* global _ */

(function(window){

  'use strict';

  //TODO do we need to use a templating tool to dynamically inject into these? callback name + injected services etc
  try {
    window.icd10Callback(icd10Transformation);
  }
  catch(error){
    console.log('Error calling back icd10 transformation', error);
  }

  /**
   *
   * @param form
   */
  function icd10Transformation(form, angularName){
    console.log('transforming icd10', form, angularName);


    var $injector = angular.injector([angularName]);
    var $http = $injector.get('$http');
    var $log = $injector.get('$log');


    var icd10Field = getField(form, 'what-two', 'diagnosis');
    console.log('transforming icd10 / diagnosis', icd10Field);

    icd10Field.link = link;
    icd10Field.templateOptions = icd10Field.templateOptions || {};

    icd10Field.templateOptions.searchTextChange = function(){
      $log.debug('address searchTextChange', arguments);
    };
    icd10Field.templateOptions.selectedItemChange = function(){
      $log.debug('address selectedItemChange', arguments);
    };
    icd10Field.templateOptions.querySearch = handleQuerySearch;


    /**
     *
     * @param scope
     */
    function link(scope){
      scope.model.diagnosis = scope.model.diagnosis || [];
    }

    /**
     *
     */
    function handleQuerySearch(query){
      return $http({
          url: '/api/mocks/icd10/' + query,
          method: 'GET',
          cache: true
        })
        .then(function(response){
          return response.data;
        });
    }

  }


  /**
   *
   * @param form
   */
  function getField(form, section, key){

    if(! form.sections[section]){
      console.log('Couldnt find section', section);
      throw new Error('Couldnt find section', section);
    }

    var i;
    for(i = 0; i < form.sections[section].fields.length; i++){
      var field = form.sections[section].fields[i];
      if(field.key === key){
        return field;
      }
    }

    console.log('Couldnt find field', section, key);
    throw new Error('Couldnt find field', section, key);
  }


})(window);
