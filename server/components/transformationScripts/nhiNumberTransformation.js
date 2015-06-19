

console.log('I AM COMING FROM THE SERVER!!!');
console.log('I AM COMING FROM THE SERVER!!!');
console.log('I AM COMING FROM THE SERVER!!!');
console.log('I AM COMING FROM THE SERVER!!!');
console.log('I AM COMING FROM THE SERVER!!!');


(function(window){

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
  function nhiNumberTransformation(form){
    console.log('transforming nhiNumber', form);

    var $injector = angular.injector();

    var nhiField = getField(form, 'who-one', 'nhiNumber');
    console.log('transforming nhiNumber', nhiField);

    nhiField.validators = nhiField.validators || {};
    nhiField.validators.nhiExists = function($modelValue, $viewValue, $scope){
      //TODO get http service from injector and validate model value against endpoint
      return $modelValue === '1111111';
    };

    nhiField.templateOptions = nhiField.templateOptions || {};
    nhiField.templateOptions.messages = nhiField.templateOptions.messages || {};
    nhiField.templateOptions.messages.nhiExists = 'Validating number to equal 1111111 from server transformation';

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