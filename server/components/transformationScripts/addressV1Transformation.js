

(function(window){

  'use strict';

  var autoCompleteService;


  //TODO do we need to use a templating tool to dynamically inject into these? callback name
  try {
    window.addressCallback(addressTransformation);

    if(! window.google || ! window.google.maps || ! window.google.maps.places){
      loadGooglePlaces();
    }
    else {
      console.log('found google library');
      autoCompleteService = new window.google.maps.places.AutocompleteService();
    }
  }
  catch(error){
    console.log('Error calling back address transformation', error);
  }

  /**
   *
   */
  function loadGooglePlaces(){
    console.log('TODO');
    throw new Error('Load google places library injecting script into dom');
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
    var $q = $injector.get('$q');

    var addressFields = getAddressFields(form);

    addressFields.map(function(addressField){
      addressField.templateOptions = addressField.templateOptions || {};

      addressField.templateOptions.noCache = false;
      addressField.templateOptions.searchTextChange = function(){
        $log.debug('address searchTextChange', arguments);
      };
      addressField.templateOptions.selectedItemChange = function(){
        $log.debug('address selectedItemChange', arguments);
      };
      addressField.templateOptions.querySearch = handleQuerySearch;

      return addressFields;
    });

    $log.debug('addressFields', addressFields);

    /**
     *
     * @param query
     * @returns {*}
     */
    function handleQuerySearch(query){

      if(! query ){
        return $q.when([]);
      }

      $log.debug('address querySearch', arguments);

      var deferred = $q.defer();

      var options = {
        input: query,
        types: ['(cities)']
      };

      //new zealand bounds?
      if (true) {
        options.bounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng({
            lat: -47,
            lng: 162
          }),
          new window.google.maps.LatLng({
            lat: -34,
            lng: 179
          }));
      }

      autoCompleteService.getQueryPredictions(options, function (results, status) {
        $log.debug('address query result and status', results, status);
        if( status === 'OK'){
          deferred.resolve(results.map(function(result){
            return result.display || result.description || 'Not found';
          }));
        }
        else {
          deferred.reject(status);
        }

      });

      return deferred.promise;

    }

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
        if(field.type === 'address'){
          addressFields.push(field);
        }
      }

    }

    return addressFields;
  }


})(window);
