'use strict';

angular.module('formerFunApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'formly',
  'ngStorage',
  'ngMaterial',
  'ngMessages'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });



angular.module('formerFunApp')
  .run(function($log, formlyConfig, $http, $localStorage){




    //defaulting template for wake up journey

    $localStorage['localFormIds_journey'] = $localStorage['localFormIds_journey'] || [];

    if($localStorage['localFormIds_journey'].indexOf('journey_502004385926') === -1){

      $localStorage['localFormIds_journey'].push('journey_502004385926');
      $localStorage['journeyjourney_502004385926'] = _.merge({
        "_formId": "journey_502004385926",
        "steps": [
          {
            "stepTitle": "Alarm goes off",
            "stepImage": "http://thumbs.dreamstime.com/x/blue-alarm-clock-17117626.jpg",
            "stepThinking": "Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She'll be right fossicker also as dry as a chuck a yewy. He's got a massive grog how lets throw a dero.",
            "stepFeeling": "Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She'll be right fossicker also as dry as a chuck a yewy. He's got a massive grog how lets throw a dero.",
            "stepDoing": "Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She'll be right fossicker also as dry as a chuck a yewy. He's got a massive grog how lets throw a dero."
          },
          {
            "stepTitle": "open eyes",
            "stepImage": "http://img4.wikia.nocookie.net/__cb20140309032630/creepypasta/images/a/af/Wake_up.jpg",
            "stepThinking": "As cross as a longneck my get a dog up ya boogie board. She'll be right fossicker also as dry as a chuck a yewy. He's got a massive grog how lets throw a dero.",
            "stepFeeling": "As cross as a longneck my get a dog up ya boogie board. She'll be right fossicker also as dry as a chuck a yewy. He's got a massive grog how lets throw a dero.",
            "stepDoing": "Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She'll be right fossicker also as dry as a chuck a yewy. He's got a massive grog how lets throw a dero."
          }
        ],
        "journeyTitle": "Wake up"
      }, $localStorage['journeyjourney_502004385926']);

    }








    // TODO move this into a template transformer
    // TODO move this into a template transformer
    // TODO move this into a template transformer :: NOTE template is in index.html
    // TODO move this into a template transformer
    formlyConfig.setType({
      name: 'repeatSection',
      template: '<div class="{{hideRepeat}}">' +
                  '<md-tabs>' +
                    '<md-tab label="{{element.stepTitle || name}}" class="repeatsection" ng-repeat="(name, element) in model[options.key]" ng-init="fields = copyFields(to.fields)">' +
                      '<md-content class="md-padding">' +
                        '<formly-form fields="fields" model="element" bind-name="\'formly_ng_repeat\' + index + $parent.$index"></formly-form> ' +
                        '<div style="margin-bottom:20px;">' +
                          '<md-button type="button" ng-show="!$first" class="md-primary md-raised" ng-click="moveLeft(model[options.key], $index)"> Move Left </md-button>' +
                          '<md-button type="button" ng-show="!$last"  class="md-primary md-raised" ng-click="moveRight(model[options.key], $index)"> Move Right </md-button>' +
                          '<md-button type="button" class="md-accent md-raised" ng-click="remove(model[options.key], $index)"> Remove </md-button>' +
                        '</div>' +
                        '<hr>' +
                      '</md-content>' +
                    '</md-tab>' +
                  '</md-tabs>' +

                  '<p class="AddNewButton"> ' +
                    '<md-button type="button" class="md-primary md-raised" ng-click="addNew()" >{{to.btnText}}</md-button>' +
                  '</p>' +
                '</div>',

      controller: function($scope) {
        $scope.formOptions = { formState: $scope.formState };
        $scope.addNew = addNew;
        $scope.remove = remove;
        $scope.moveLeft = moveLeft;
        $scope.moveRight = moveRight;

        $scope.copyFields = copyFields;

        function copyFields(fields) {
          return angular.copy(fields);
        }

        function moveLeft(model, index){
          var temp = model[index];
          model[index] = model[index - 1];
          model[index - 1] = temp;
        }

        function moveRight(model, index){
          var temp = model[index];
          model[index] = model[index + 1];
          model[index + 1] = temp;
        }

        function remove(model, $index){
          model.splice($index, 1);
        }

        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};

          //if (lastSection) {
          //  newsection = angular.copy(lastSection);
          //}

          repeatsection.push(newsection);
        }
      }
    });

  });
