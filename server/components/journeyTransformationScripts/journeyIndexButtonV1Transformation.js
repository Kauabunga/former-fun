
(function(window){

  'use strict';

  //TODO do we need to use a templating tool to dynamically inject into these? callback name + injected services etc
  try {
    window.journeyIndexButtonCallback(journeyIndexButtonTransformation);
  }
  catch(error){
    console.log('Error calling back journeyIndexButton transformation', error);
  }

  /**
   *
   * @param form
   */
  function journeyIndexButtonTransformation(form, angularName){
    console.log('transforming journeyIndexButton', form, angularName);


    var $injector = angular.injector([angularName]);
    //var $http = $injector.get('$http');

    //var $state = $injector.get('$state');
    //var $location = $injector.get('$location');

    var $stateParams = $injector.get('$stateParams');
    var $log = $injector.get('$log');




    var viewJourneyRepeater = getField(form, 'start', 'steps');

    _.map(viewJourneyRepeater.templateOptions.fields, function(field){
      if(field.type === 'journeyIndex'){
        transformJourneyIndex(field);
      }
      else {
        return field;
      }
    });


    /**
     *
     * @param field
     */
    function transformJourneyIndex(field){

      field.link = link;
      field.templateOptions = field.templateOptions || {};


    }

    /**
     *
     * @param scope
     */
    function link(scope){

      scope.getIndex = function() {
        return getIndex() + 1;
      };

      function getIndex(){
        return scope.$parent.$parent.$parent.$parent.$index;
      }

      console.log(scope);
      console.log(scope);
      console.log(scope);
      console.log(scope);
      scope.getTargetIndexes = function(){
        var count = scope.$parent.$parent.$parent.$parent.$parent.model.steps.length;
        var currentIndex = getIndex();
        var i;
        var indexes = [];
        for(i = 0; i < count; i++){
          if(i === currentIndex){
            continue;
          }
          indexes.push('' + i);
        }

        return indexes;
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
