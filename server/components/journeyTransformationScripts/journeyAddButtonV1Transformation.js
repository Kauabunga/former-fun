
(function(window){

  'use strict';

  //TODO do we need to use a templating tool to dynamically inject into these? callback name + injected services etc
  try {
    window.journeyAddButtonCallback(journeyAddButtonTransformation);
  }
  catch(error){
    console.log('Error calling back journeyAddButton transformation', error);
  }

  /**
   *
   * @param form
   */
  function journeyAddButtonTransformation(form, angularName){
    console.log('transforming journeyAddButton', form, angularName);


    var $injector = angular.injector([angularName]);
    var $stateParams = $injector.get('$stateParams');
    var $log = $injector.get('$log');
    var $timeout = $injector.get('$timeout');




    var viewJourneyRepeater = getField(form, 'start', 'steps');

    _.map(viewJourneyRepeater.templateOptions.fields, function(field){
      if(field.type === 'journeyAdd'){
        transformJourneyAdd(field);
      }
      else {
        return field;
      }
    });


    /**
     *
     * @param field
     */
    function transformJourneyAdd(field){
      field.link = link;
      field.templateOptions = field.templateOptions || {};
    }

    /**
     *
     * @param scope
     */
    function link(scope){


      function getIndex(){
        return scope.$parent.$parent.$parent.$parent.$index;
      }

      scope.addNew = function() {
        var model = scope.$parent.$parent.$parent.$parent.$parent.model.steps;
        var newsection = {};

        model.splice(getIndex() + 1, 0, newsection);
        //model.push(newsection);
      }
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
