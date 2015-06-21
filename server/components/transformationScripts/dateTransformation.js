
(function(window){

  'use strict';

  //TODO do we need to use a templating tool to dynamically inject into these? callback name + injected services etc
  try {
    window.dateCallback(dateTransformation);
  }
  catch(error){
    console.log('Error calling back date transformation', error);
  }

  /**
   *
   * @param form
   */
  function dateTransformation(form, angularName){
    console.log('transforming date types', form, angularName);

    var $injector = angular.injector([angularName]);
    var $http = $injector.get('$http');
    var $log = $injector.get('$log');
    var $q = $injector.get('$q');

    var dateFields = getDateFields(form);

    dateFields.map(function(dateField){
      dateField.templateOptions = dateField.templateOptions || {};

      dateField.link = link;

      /**
       *
       * @param scope
       * @param el
       * @param attrs
       * @param ctrl
       */
      function link(scope, el, attrs, ctrl) {
        if(scope.model[dateField.key]){
          scope.model[dateField.key] = new Date(scope.model[dateField.key]);
        }
      }

      return dateField;
    });

    $log.debug('dateFields', dateFields);




  }


  /**
   *
   * @param form
   */
  function getDateFields(form){

    var dateFields = [];

    for (var section in form.sections){
      var i;
      for(i = 0; i < form.sections[section].fields.length; i++){
        var field = form.sections[section].fields[i];
        if(field.type === 'date'){
          dateFields.push(field);
        }
      }

    }

    return dateFields;
  }


})(window);
