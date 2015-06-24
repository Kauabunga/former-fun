'use strict';

angular.module('formerFunApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'monospaced.elastic',
  'formly',
  'ngStorage',
  'ngMaterial',
  'ngAnimate',
  'ngTouch',
  'ngMessages'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);


    $mdThemingProvider.definePalette('primaryPalette', {
      '50': '4af100', // STUPID LIME GREEN used to identify areas needing attention
      '100': '7ddcf9', //Searching bar styling
      '200': '4af100',
      '300': '4af100',
      '400': '4af100',
      '500': '2eb2e6', // Primary hue for buttons & active states
      '600': '8c8c8c', // Mid tone blue for disabled buttons
      '700': '4af100',
      '800': '4af100',
      '900': '4af100',
      'A100': '4af100',
      'A200': '4af100',
      'A400': '4af100',
      'A700': '4af100',
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    $mdThemingProvider.definePalette('accentPalette', {
      '50': '4af100',
      '100': '4af100',
      '200': '4af100',
      '300': '4af100',
      '400': '4af100',
      '500': '4af100',
      '600': '4af100',
      '700': '4af100',
      '800': '4af100',
      '900': '4af100',
      'A100': '4af100',
      'A200': '2eb2e6', // Default primary hue for checkboxes/radios
      'A400': '4af100',
      'A700': '4af100',
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('orange');

  });



angular.module('formerFunApp')
  .run(function($log, formlyConfig, $http, $localStorage){


    var formIdsKey = 'localFormIds_journey';
    var formDataKey = '_502004385926';

    //defaulting template for wake up journey

    $localStorage[formIdsKey] = $localStorage[formIdsKey] || [];

    if($localStorage[formIdsKey].indexOf('_502004385926') === -1){

      $localStorage[formIdsKey].push('_502004385926');
      $localStorage[formDataKey] = _.merge({
        '_formId': '_502004385926',
        'steps': [
          {
            'stepTitle': 'Alarm goes off',
            'stepBlurb': 'This is my step blurb',
            'stepTime': '6am',
            'stepImage': 'http://thumbs.dreamstime.com/x/blue-alarm-clock-17117626.jpg',
            'stepThinking': 'Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.',
            'stepFeeling': 'Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.',
            'stepDoing': 'Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.'
          },
          {
            'stepTitle': 'open eyes',
            'stepBlurb': 'This is my step blurb',
            'stepTime': '6:10am',
            'stepImage': 'http://img4.wikia.nocookie.net/__cb20140309032630/creepypasta/images/a/af/Wake_up.jpg',
            'stepThinking': 'As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.',
            'stepFeeling': 'As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.',
            'stepDoing': 'Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.'
          },
          {
            'stepTitle': 'Yawn',
            'stepBlurb': 'This is my step blurb',
            'stepTime': '6:25am',
            'stepImage': 'http://www.bandofcats.com/wp-content/uploads/2009/09/43_cat-yawns.jpg',
            'stepThinking': 'As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.',
            'stepFeeling': 'As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.',
            'stepDoing': 'Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.'
          },
          {
            'stepTitle': 'Get dressed',
            'stepBlurb': 'This is my step blurb',
            'stepTime': '6:45am',
            'stepImage': 'http://24.media.tumblr.com/tumblr_ls5cayTKJY1qebqlto1_500.jpg',
            'stepThinking': 'As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.',
            'stepFeeling': 'As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.',
            'stepDoing': 'Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.'
          },
          {
            'stepTitle': 'Walk into wall',
            'stepBlurb': 'This is my step blurb',
            'stepTime': '6:55am',
            'stepImage': 'http://blog.contagiouscompanies.com/wp-content/uploads/2014/09/Banging-your-head-against-a-wall.jpg',
            'stepThinking': 'As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.',
            'stepFeeling': 'As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.',
            'stepDoing': 'Lets throw a lizard drinking where lets throw a old fella. As cross as a longneck my get a dog up ya boogie board. She\'ll be right fossicker also as dry as a chuck a yewy. He\'s got a massive grog how lets throw a dero.'
          }
        ],
        'journeyTitle': 'My morning wake up'
      }, $localStorage[formDataKey]);

    }








    // TODO move this into a template transformer
    // TODO move this into a template transformer
    // TODO move this into a template transformer :: NOTE template is in index.html
    // TODO move this into a template transformer



    formlyConfig.setType({
      name: 'repeatJourneyStep',
      template: '<div class="repeatsection {{::to.className}}" ng-repeat="(name, element) in model[options.key]" ng-init="fields = copyFields(to.fields)">' +
                  '<formly-form fields="fields" model="element" bind-name="\'formly_ng_repeat\' + index + $parent.$index"></formly-form> ' +
                '</div>',

      controller: function($scope) {
        $scope.formOptions = { formState: $scope.formState };

        $scope.copyFields = copyFields;

        function copyFields(fields) {
          return angular.copy(fields);
        }

      }
    });



    formlyConfig.setType({
      name: 'journeyEmotions',
      template: '<md-tabs class="journey-emotions {{hideRepeat}}" md-no-pagination="false" md-stretch-tabs="never" md-dynamic-height="true">' +
                  '<md-tab label="{{field.label || name}}" class="repeatsection" ng-repeat="(name, field) in to.fields">' +
                    '<md-content class="md-padding">' +
                      '<p ng-focus="isFocused = true" ng-blur="isFocused = false" ng-class="{\'is-focused\': isFocused}" class="inlineparagraph {{to.className}}}">' +
                        '<textarea msd-elastic="\n" ng-model="model[field.key]" />' +
                      '</p>' +
                    '</md-content>' +
                  '</md-tab>' +
                '</md-tabs>',

      controller: function($scope) {
        $scope.formOptions = { formState: $scope.formState };

        $scope.copyFields = copyFields;

        function copyFields(fields) {
          return angular.copy(fields);
        }

      }
    });


    formlyConfig.setType({
      name: 'repeatSection',
      template: '<md-tabs class="{{hideRepeat}}" md-no-pagination="false" md-stretch-tabs="never" md-dynamic-height="true">' +
                    '<md-tab label="{{element.stepTitle || name}}" class="repeatsection" ng-repeat="(name, element) in model[options.key]" ng-init="fields = copyFields(to.fields)">' +
                      '<md-content class="md-padding">' +
                        '<div ng-hide="to.disableButtons" style="margin-bottom:20px;">' +
                          '<md-button type="button" ng-show="!$first" class="md-primary md-raised" ng-click="moveLeft(model[options.key], $index)"> Move Left </md-button>' +
                          '<md-button type="button" ng-show="!$last"  class="md-primary md-raised" ng-click="moveRight(model[options.key], $index)"> Move Right </md-button>' +
                          '<md-button type="button" class="md-accent md-raised" ng-click="remove(model[options.key], $index)"> Remove </md-button>' +
                        '</div>' +
                        '<formly-form fields="fields" model="element" bind-name="\'formly_ng_repeat\' + index + $parent.$index"></formly-form> ' +
                        '<div ng-hide="to.disableButtons" style="margin-bottom:20px;">' +
                          '<md-button type="button" ng-show="!$first" class="md-primary md-raised" ng-click="moveLeft(model[options.key], $index)"> Move Left </md-button>' +
                          '<md-button type="button" ng-show="!$last"  class="md-primary md-raised" ng-click="moveRight(model[options.key], $index)"> Move Right </md-button>' +
                          '<md-button type="button" class="md-accent md-raised" ng-click="remove(model[options.key], $index)"> Remove </md-button>' +
                        '</div>' +
                        '<hr>' +
                      '</md-content>' +
                    '</md-tab>' +
                  '</md-tabs>' +
                  '<p ng-hide="to.disableButtons" class="AddNewButton"> ' +
                    '<md-button type="button" class="md-primary md-raised" ng-click="addNew()" >{{to.btnText}}</md-button>' +
                  '</p>',
      defaultOptions: {
        templateOptions: {
          disableButtons: false
        }
      },

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

          var newsection = {};
          var repeatsection = $scope.model[$scope.options.key];

          //var lastSection = repeatsection[repeatsection.length - 1];
          //if (lastSection) {
          //  newsection = angular.copy(lastSection);
          //}

          repeatsection.push(newsection);
        }
      }
    });

  });
