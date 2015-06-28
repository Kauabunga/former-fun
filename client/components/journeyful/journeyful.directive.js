

'use strict';

angular.module('formerFunApp')
  .directive('journeyful', function ($log, $timeout) {

    return {
      templateUrl: 'components/journeyful/journeyful.html',
      restrict: 'E',
      scope: {
        journeyDefinition: '='
      },
      link: function (scope, element, attrs) {

        $log.debug('journeyDefinition', scope.journeyDefinition);

        scope.fadeIn = false;
        scope.scrollToStep = scrollToStep;


        var journeyDefinitionWatcherDestroy = scope.$watch('journeyDefinition', function() {
          $log.debug('journeyDefinition watcher', scope.journeyDefinition);
          if(scope.journeyDefinition){
            journeyDefinitionWatcherDestroy();
            init();
          }
        });

        /**
         *
         */
        function init(){
          $timeout(function(){
            scope.fadeIn = true;
          });

        }


        /**
         *
         * @param step
         */
        function scrollToStep(step, $index){
          $log.debug('scrolling to step', step, $index);

          $timeout(function(){
            var $stepContainer = $('.step-container');
            var stepContainerWidth = $stepContainer.outerWidth() * 0.75;

            var offset = 0;
            if($index !== 0){
              offset += stepContainerWidth;
            }
            offset += (Math.max(0, $index - 1 ) * (stepContainerWidth * 2));

            $('.journey-wrapper').animate({scrollLeft: offset }, 300);

          });

        }


        /**
         *
         * @param step
         */
        scope.toggleZoom = function toggleZoom(step, $index) {
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




      }
    };
  });
