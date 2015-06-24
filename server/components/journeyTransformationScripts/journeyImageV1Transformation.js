
(function(window){

  'use strict';

  //TODO do we need to use a templating tool to dynamically inject into these? callback name + injected services etc
  try {
    window.journeyImageCallback(journeyImageTransformation);
  }
  catch(error){
    console.log('Error calling back journeyImage transformation', error);
  }

  /**
   *
   * @param form
   */
  function journeyImageTransformation(form, angularName){
    console.log('transforming journeyImage', form, angularName);


    var $injector = angular.injector([angularName]);

    var $stateParams = $injector.get('$stateParams');
    var $log = $injector.get('$log');


    var viewJourneyRepeater = getField(form, 'start', 'steps');


    $log.debug('transforming viewJourneyRepeater', viewJourneyRepeater);

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
