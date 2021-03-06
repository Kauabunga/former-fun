
(function(window){

  'use strict';

  //TODO do we need to use a templating tool to dynamically inject into these? callback name + injected services etc
  try {
    window.viewJourneyButtonCallback(viewJourneyButtonTransformation);
  }
  catch(error){
    console.log('Error calling back viewJourneyButton transformation', error);
  }

  /**
   *
   * @param form
   */
  function viewJourneyButtonTransformation(form, angularName){
    console.log('transforming viewJourneyButton', form, angularName);


    var $injector = angular.injector([angularName]);
    //var $http = $injector.get('$http');

    //var $state = $injector.get('$state');
    //var $location = $injector.get('$location');

    var $stateParams = $injector.get('$stateParams');
    var $log = $injector.get('$log');


    var viewJourneyButton = getField(form, 'start', 'viewJourney');
    var viewInlineJourneyButton = getField(form, 'start', 'viewInlineJourney');
    $log.debug('transforming viewJourneyButton', viewJourneyButton, viewInlineJourneyButton);

    if( ! viewJourneyButton.templateOptions.targetState ){
      $log.warn('No targetState in template options');
    }

    if( ! viewJourneyButton.templateOptions.currentStateIdParam ){
      $log.warn('No stateIdParam in template options');
    }

    if( ! viewJourneyButton.templateOptions.targetStateIdParam ){
      $log.warn('No stateIdParam in template options');
    }

    viewJourneyButton.templateOptions = viewJourneyButton.templateOptions || {};
    viewInlineJourneyButton.templateOptions = viewInlineJourneyButton.templateOptions || {};
    viewJourneyButton.templateOptions.formerActionButton = viewJourney;
    viewInlineJourneyButton.templateOptions.formerActionButton = viewJourney;

    /**
     *
     * @param $event
     * @param scope
     */
    function viewJourney($event, scope, to){
      $log.debug('view Journey', $event, to);

      //TODO stateparams based off config
      var params = {};
      params[to.targetStateIdParam] = $stateParams[to.currentStateIdParam];
      scope.$emit('go', to.targetState, params);
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
