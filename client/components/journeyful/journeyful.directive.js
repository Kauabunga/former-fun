

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


        /**
         *
         */
        function init(){


        }


      }
    };
  });
