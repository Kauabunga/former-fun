


(function(window){

  //TODO do we need to use a templating tool to dynamically inject into these? callback name + injected services etc
  try {
    window.addressCallback(addressTransformation);
  }
  catch(error){
    console.log('Error calling back address transformation', error);
  }

  /**
   *
   * @param form
   */
  function addressTransformation(form, angularName){
    console.log('transforming address types', form, angularName);

    var $injector = angular.injector([angularName]);
    var $http = $injector.get('$http');
    var $log = $injector.get('$log');

    var addressFields = getAddressFields(form);

    $log.debug('addressFields', addressFields);

    addressFields.map(function(addressField){
      addressField.templateOptions = addressField.templateOptions || {};
      addressField.templateOptions.noCache = false;
      addressField.templateOptions.searchTextChange = function(){
        $log.debug('address searchTextChange');
      };
      addressField.templateOptions.selectedItemChange = function(){
        $log.debug('address selectedItemChange');
      };
      addressField.templateOptions.querySearch = function(){
        $log.debug('address querySearch');
        return [
          {
            display: 'mooo'
          }
        ]
      };

    });
  }


  /**
   *
   * @param form
   */
  function getAddressFields(form){

    var addressFields = [];

    for (var section in form.sections){
      var i;
      for(i = 0; i < form.sections[section].fields.length; i++){
        var field = form.sections[section].fields[i];
        console.log(field);
        if(field.type === 'address'){
          addressFields.push(field);
        }
      }

    }

    return addressFields;
  }


})(window);