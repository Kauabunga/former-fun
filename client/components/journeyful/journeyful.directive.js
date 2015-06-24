

'use strict';

angular.module('formerFunApp')
  .directive('journeyful', function ($log, $state, $stateParams, $rootScope, $localStorage, former) {

    return {
      templateUrl: 'components/journeyful/journeyful.html',
      restrict: 'E',
      scope: {
        journeyDefinition: '='
      },
      link: function (scope, element, attrs) {

        $log.debug('journeyDefinition', scope.journeyDefinition);

        var journeyDefinitionWatcherDestroy = scope.$watch('journeyDefinition', function() {
          $log.debug('journeyDefinition watcher', scope.journeyDefinition);
          if(scope.journeyDefinition){
            journeyDefinitionWatcherDestroy();
            init();
          }
        });

        scope.toggleZoom = function toggleZoom(step) {
          console.log(' togglin...');
          var unfocusAll = function(step) {
            _.each(scope.journeyDefinition.steps, function(item) {
              if(step !== item) {
                item.unfocus = true;
                item.focus = false;
              }
            });
          };
          // first - all steps reset
          // This happens everytime there is a click
          _.each(scope.journeyDefinition.steps, function(item) {
            item.unfocus = false;
          });
          // second - we toggle the focus class on the item being clicked
          _.each(scope.journeyDefinition.steps, function(item) {
            // if this is the step being clicked
            if(step === item) {
              // if the item is already in focus
              if(item.focus){
                // switch focus class off
                item.focus = false;
              }
              else {
                // or switch the focus class on
                item.focus = true;
                // add unfocus classes to all other steps
                unfocusAll(step);
              }
            } else {

            }
          });
        };


        /**
         *
         */
        function init(){


        }


      }
    };
  });
