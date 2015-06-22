
(function(window){

  'use strict';

  //TODO do we need to use a templating tool to dynamically inject into these? callback name + injected services etc
  try {
    window.injuryDateCallback(injuryDateTransformation);
  }
  catch(error){
    console.log('Error calling back injuryDate transformation', error);
  }

  /**
   *
   * @param form
   */
  function injuryDateTransformation(form, angularName){
    console.log('transforming injuryDate', form, angularName);


    var $injector = angular.injector([angularName]);
    var $http = $injector.get('$http');


    var injuryDateTodayButton = getField(form, 'when-one', 'setInjuryDateToToday');
    var injuryDateYesterdayButton = getField(form, 'when-one', 'setInjuryDateToYesterday');
    console.log('transforming injuryDate', injuryDateTodayButton, injuryDateYesterdayButton);

    injuryDateTodayButton.templateOptions = injuryDateTodayButton.templateOptions || {};
    injuryDateYesterdayButton.templateOptions = injuryDateYesterdayButton.templateOptions || {};
    injuryDateTodayButton.templateOptions.formerActionButton = setToToday;
    injuryDateYesterdayButton.templateOptions.formerActionButton = setToYesterday;

    function setToToday($event, scope){
      scope.model.injuryDate = new Date();
    }

    function setToYesterday($event, scope){
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      scope.model.injuryDate = yesterday;
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
