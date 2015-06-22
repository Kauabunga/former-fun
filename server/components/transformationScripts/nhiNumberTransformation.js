
/* global _ */

(function(window){

  'use strict';

  //TODO do we need to use a templating tool to dynamically inject into these? callback name + injected services etc
  try {
    window.nhiNumberCallback(nhiNumberTransformation);
  }
  catch(error){
    console.log('Error calling back nhiNumber transformation', error);
  }

  /**
   *
   * @param form
   */
  function nhiNumberTransformation(form, angularName){
    console.log('transforming nhiNumber', form, angularName);


    var $injector = angular.injector([angularName]);
    var $http = $injector.get('$http');


    var nhiField = getField(form, 'who-one', 'nhiNumber');
    console.log('transforming nhiNumber', nhiField);

    nhiField.validators = nhiField.validators || {};
    nhiField.validators.nhiExists = checkNhiExists;

    nhiField.templateOptions = nhiField.templateOptions || {};
    nhiField.templateOptions.messages = nhiField.templateOptions.messages || {};
    nhiField.templateOptions.messages.nhiExists = 'Validating number to equal 1111111 from server transformation';


    function checkNhiExists($modelValue, $viewValue, $scope){
      return $http.get('/api/mocks/nhi/' + $modelValue)
        .then(function(response){
          return response.data;
        })
        .then(function(nhiResult){
          console.log('successful response', form, nhiResult);

          _.merge($scope.model, nhiResult);
          if(nhiResult.dob){
            $scope.model.dob = new Date(nhiResult.dob);
          }

          return true;
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
      console.log(field);
      if(field.key === key){
        return field;
      }
    }

    console.log('Couldnt find field', section, key);
    throw new Error('Couldnt find field', section, key);
  }


})(window);
