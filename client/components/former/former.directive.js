'use strict';

angular.module('formerFunApp')
  .directive('former', function ($log, $state, $stateParams, $rootScope, $localStorage) {

    return {
      templateUrl: 'components/former/former.html',
      restrict: 'E',
      scope: {
        formDefinition: '=',
        formModel: '=',
        formControls: '=?',
        formSectionStateParam: '@',
        formIdStateParam: '@',
        buttonActionEvent: '@?'
      },
      link: function (scope, element, attrs) {

        scope.formId = $stateParams[scope.formIdStateParam];
        scope.formSection = $stateParams[scope.formSectionStateParam];
        scope.formFields = undefined;


        //TODO link this event up correctly with button template - may be better to decorate buttons with js functions
        scope.buttonActionEvent = scope.buttonActionEvent || 'formerButtonAction';
        //TODO need to pull this out into a separate pluggable module
        scope.flowButtonAction = flowButtonAction;
        scope.$on(scope.buttonActionEvent, handleButtonEvent);


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

          if( ! scope.formSection || ! scope.formId){
            scope.formId = scope.formId || getNewFormLocalStorageId();
            scope.formSection = scope.formSection || scope.formDefinition.defaultSection;
            transitionTo(scope.formSection, scope.formId, true);
          }
          else {
            //bind form model to local scope with formId
            scope.formModel = $localStorage[scope.formModel.name + scope.formId] = $localStorage[scope.formModel.name + scope.formId] || {};
            loadSection(scope.formDefinition.sections[scope.formSection]);
          }
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
         */
        function getNewFormLocalStorageId(){
          //TODO push number to localStorage list
          return _.random(10000001, 99999999);
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
          var options = replace ? { location: 'replace' } : {};
          $state.transitionTo(
            $state.current.name,
            $stateParams,
            options
          );
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
            $log.warn('No button action resolved');
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

          //TODO need to double check model / required states for all fields

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
              field.formControl.$submitted = true;
            }
          });
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

      }
    };
  });
