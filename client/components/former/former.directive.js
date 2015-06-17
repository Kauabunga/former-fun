'use strict';

angular.module('formerFunApp')
  .directive('former', function ($log, $state, $stateParams, $rootScope) {

    var ROOTSCOPE_FORMKEY = Symbol('formkey');

    return {
      templateUrl: 'components/former/former.html',
      restrict: 'E',
      scope: {
        formDefinition: '=',
        formModel: '=',
        formControls: '=?',
        formSectionStateParam: '@',
        buttonActionEvent: '@?'
      },
      link: function (scope, element, attrs) {

        //TODO storing in rootScope - controllers responsibility to store in localStorage? Option?
        scope.formModel = scope.formModel || {};
        scope.formModel = _.merge(scope.formModel, $rootScope[ROOTSCOPE_FORMKEY]);
        $rootScope[ROOTSCOPE_FORMKEY] = scope.formModel;



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
          var currentSection = $stateParams[scope.formSectionStateParam];
          if(currentSection){
            loadSection(scope.formDefinition.sections[currentSection])
          }
          else {
            transitionTo(scope.formDefinition.defaultSection, true);
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
         * @param targetSection
         * @param replace
         */
        function transitionTo(targetSection, replace){
          $stateParams[scope.formSectionStateParam] = targetSection;
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
          var shouldValidate = getValidateOption(templateOptions);
          var targetFlow = getTargetFlowOption(templateOptions);

          if(shouldValidate === undefined){
            $log.warn('No validate option passed to flow button action');
          }

          if(targetFlow === undefined){
            $log.error('No target flow passed to flow button action');
          }

          if (shouldValidate) {
            updateSubmittedState(scope.formControls, scope.formFields);

            $log.debug('Form valid state', scope.formControls.$valid);
            if(scope.formControls.$invalid){
              return false;
            }
          }

          return transitionTo(targetFlow);
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
