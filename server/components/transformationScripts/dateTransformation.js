


(function(window){

  var autoCompleteService;


  //TODO do we need to use a templating tool to dynamically inject into these? callback name + injected services etc
  try {
    window.dateCallback(dateTransformation);

    if(! window.google || ! google.maps || ! google.maps.places){
      loadGooglePlaces();
    }
    else {
      console.log('found google library');
      autoCompleteService = new google.maps.places.AutocompleteService();
    }


  }
  catch(error){
    console.log('Error calling back date transformation', error);
  }

  /**
   *
   */
  function loadGooglePlaces(){
    console.log('TODO');
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
