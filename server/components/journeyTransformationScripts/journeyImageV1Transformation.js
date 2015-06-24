
/* global _ */

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

    _.map(viewJourneyRepeater.templateOptions.fields, function(field){
      if(field.type === 'journeyImage'){
        transformJourneyImage(field);
      }
      else {
        return field;
      }
    });

    $log.debug('transforming viewJourneyRepeater', viewJourneyRepeater);


    /**
     *
     * @param field
     */
    function transformJourneyImage(field){

      $log.debug('transforming viewJourneyImage', field);

      field.link = function(scope){
        scope.model.stepImage = scope.model.stepImage || 'https://upload.wikimedia.org/wikipedia/commons/3/33/White_square_with_question_mark.png';
      };

      field.templateOptions.formerActionButton = function($event, scope){

        //TODO add double click behaviour to edit image
        //TODO if no image url then default to edit image

        $log.debug('Journey Image click', scope);

        var allSteps = scope.$parent.$parent.$parent.$parent.model.steps;
        var currentStep = scope.model;

        var unfocusAll = function(step) {
          _.each(allSteps, function(item) {
            if(step !== item) {
              item.unfocus = true;
              item.focus = false;
            }
          });
        };

        // first - all steps reset
        // This happens everytime there is a click
        _.map(allSteps, function(step) {
          step.unfocus = false;
        });

        // first - all steps reset
        // This happens everytime there is a click
        _.map(allSteps, function(item) {
          item.unfocus = false;
        });
        // second - we toggle the focus class on the item being clicked
        _.map(allSteps, function(item) {
          // if this is the step being clicked
          if(currentStep === item) {
            // if the item is already in focus
            if(item.focus)
            // switch focus class off
              item.focus = false;
            else {
              // or switch the focus class on
              item.focus = true;
              // add unfocus classes to all other steps
              unfocusAll(currentStep);
            }
          } else {

          }
        });

      };

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
