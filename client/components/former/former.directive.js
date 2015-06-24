

'use strict';

angular.module('formerFunApp')
  .directive('former', function ($log, $state, $stateParams, $rootScope, $localStorage, former) {

    return {
      templateUrl: 'components/former/former.html',
      restrict: 'E',
      scope: {
        formDefinition: '=',
        formModel: '=',
        formControls: '=?',
        formSubmit: '&',
        formSectionStateParam: '@',
        formIdStateParam: '@',
        buttonActionEvent: '@?'
      },
      link: function (scope, element, attrs) {

        scope.formId = $stateParams[scope.formIdStateParam];
        scope.formSection = $stateParams[scope.formSectionStateParam];
        scope.formFields = undefined;
        scope.formName = undefined;

        //TODO this submit action should come from scope main.ctrl?
        // optional?
        scope.submitFormer = submitFormer;

        //TODO link this event up correctly with button template - may be better to decorate buttons with js functions
        scope.buttonActionEvent = scope.buttonActionEvent || 'formerButtonAction';
        //TODO need to pull this out into a separate pluggable module
        scope.flowButtonAction = flowButtonAction;
        scope.$on(scope.buttonActionEvent, handleButtonEvent);

        scope.$on('go', stateGoFromEvent);


        var formDefinitionWatcherDestroy = scope.$watch('formDefinition', function() {
          $log.debug('formDefinition watcher', scope.formDefinition, scope.formModel);
          if(scope.formDefinition){
            formDefinitionWatcherDestroy();
            init();
          }
        });


        /**
         *
         */
        function init(){

          scope.formName = scope.formDefinition.name;

          var validFormId = isValidFormId(scope.formId);
          var validFormSection = isValidFormSection(scope.formSection);

          if( ! validFormSection || ! validFormId){
            scope.formId = validFormId ? scope.formId : getNewFormLocalStorageId();
            scope.formSection = validFormSection ? scope.formSection : scope.formDefinition.defaultSection;

            scope.$evalAsync(function(){
              transitionTo(scope.formSection, scope.formId, true);
            });

          }
          else {
            var modelKey = getFormModelKey();
            //bind form model to local scope with formId
            //TODO this model should come from the former service????
            scope.formModel = $localStorage[modelKey] = $localStorage[modelKey] || {};

            //write formId to model
            scope.formModel._formId = scope.formId;

            loadSection(scope.formDefinition.sections[scope.formSection]);
          }
        }

        /**
         *
         * @returns {*}
         */
        function getFormModelKey(){
          //return scope.formDefinition.name + scope.formId;
          return scope.formId;
        }

        /**
         *
         * @param formDefinition
         * @param formSection
         */
        function loadSection(formSection){
          $log.debug('Loading form section', formSection);
          scope.formFields = formSection.fields;
        }

        /**
         *
         * @param formSection
         */
        function isValidFormSection(formSection){
          return formSection && scope.formDefinition.sections[formSection] !== undefined;
        }

        /**
         *
         */
        function getNewFormLocalStorageId(){

          //ensure id is unique to local storage
          var newId = createNewId();
          var localStorageKey = former.getLocalFormIdsKey(scope.formDefinition.name);
          $localStorage[localStorageKey] = $localStorage[localStorageKey] || [];

          while($localStorage[localStorageKey].indexOf(newId) !== -1){
            newId = createNewId();
          }
          return newId;
        }

        /**
         *
         * @returns {string}
         */
        function createNewId(){
          return '_' + _.random(100000000001, 999999999999);
          //return scope.formDefinition.name + '_' + _.random(100000000001, 999999999999);
        }


        /**
         *
         * @param formId
         */
        function isValidFormId(formId){

          var formName = getFormName();
          //var formRegex = new RegExp('\\b' + formName + '_\\d{12}\\b');
          var formRegex = new RegExp('\\b' + '_\\d{12}\\b');

          return formId && formRegex.test(formId);
        }

        /**
         *
         */
        function submitFormer(formModel, formControls, formFields){
          $log.debug('submitFormer -- formModel, formControls, formFields', formModel, formControls, formFields);

          return scope.formSubmit({
            formModel: formModel,
            formControls: formControls,
            formFields: formFields
          });
        }

        /**
         *
         * @param targetSection
         * @param replace
         */
        function transitionTo(targetSection, targetId, replace){

          if(targetSection){
            $stateParams[scope.formSectionStateParam] = targetSection;
          }
          if(targetId){
            $stateParams[scope.formIdStateParam] = targetId;
          }

          trackFormId($stateParams[scope.formIdStateParam]);

          var options = replace ? { location: 'replace' } : {};
          $state.transitionTo(
            $state.current.name,
            $stateParams,
            options
          );
        }


        /**
         *
         * @param id
         */
        function trackFormId(id){
          var localStorageKey = former.getLocalFormIdsKey(scope.formDefinition.name);
          $localStorage[localStorageKey] = $localStorage[localStorageKey] || [];
          if($localStorage[localStorageKey].indexOf(id) === -1){
            $localStorage[localStorageKey].push(id);
          }
        }


        /**
         *
         * @param $event
         * @param action
         */
        function handleButtonEvent(eventScope, $event, templateOptions){
          $log.debug('handleButtonEvent :: button action', arguments);

          var action = templateOptions.action;
          if(typeof scope[action] === 'function'){
            scope[action]($event, templateOptions);
          }
          else{
            //TODO run formerButtonAction here?
            $log.warn('No button action resolved', templateOptions);
          }
        }

        /**
         *
         * @param $event
         * @param templateOptions
         */
        function flowButtonAction($event, templateOptions){

          //TODO should be able to decorate this action with transformation components
          // decorate all buttons?

          //TODO check to see if there is a formerButtonAction function attached to the button
          //    call that - if returns promise etc...

          var shouldValidate = getValidateOption(templateOptions);
          var targetFlow = getTargetFlowOption(templateOptions);

          if(shouldValidate === undefined){
            $log.warn('No validate option passed to flow button action');
          }

          if(targetFlow === undefined){
            $log.error('No target flow passed to flow button action');
          }

          $log.debug('flowButtonAction', scope);

          if (shouldValidate) {
            updateSubmittedState(scope.formControls, scope.formFields);

            if( ! isFormValid(scope.formControls)){
              return false;
            }
          }

          return transitionTo(targetFlow);
        }

        /**
         *
         * @param form
         */
        function isFormValid(form){
          $log.debug('is form valid', form, form.$valid);
          return form.$valid;
        }

        /**
         *
         * @param controls
         * @param fields
         */
        function updateSubmittedState(controls, fields){
          controls.$submitted = true;

          fields.map(function(field){
            if(field && field.formControl){
              if(field.formControl.constructor === Array){
                field.formControl.map(function(formControl){
                  formControl.$submitted = true;
                });
              }
              else{
                field.formControl.$submitted = true;
              }
            }
          });
        }

        /**
         *
         */
        function stateGoFromEvent($event, stateName, stateParams, stateOptions){
          $log.debug('stateGoFromEvent', stateName, stateParams, stateOptions);
          $state.go(stateName, stateParams, stateOptions);
        }

        /**
         *
         * @param templateOptions
         */
        function getValidateOption(templateOptions){
          return templateOptions.validate;
        }

        /**
         *
         * @param templateOptions
         */
        function getTargetFlowOption(templateOptions){
          return templateOptions.flow;
        }

        /**
         *
         * @returns {*}
         */
        function getFormName(){
          return scope.formDefinition.name;
        }

      }
    };
  });
