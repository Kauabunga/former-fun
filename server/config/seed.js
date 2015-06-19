/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Template = require('../api/template/template.model');
var Transformation = require('../api/transformation/transformation.model');
var Form = require('../api/form/form.model');



Transformation.find({}).remove(function() {
  Transformation.create(
    {
      name: 'nhiNumber',
      scriptFilePath: './server/components/transformationScripts/nhiNumberTransformation.js'
    }
  );
});


Form.find({}).remove(function() {
  Form.create(
    {
      defaultSection: 'who-one',
      transformationModules: {
        baseurl: '/api/transformations',
        modules: ['nhiNumber']
      },
      sections: {
        'who-one': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'Who was hurt?'
              }
            },
            {
              key: 'nhiNumber',
              type: 'input',
              templateOptions: {
                label: 'NHI Number',
                required: true,
                maxlength: 7,
                minlength: 7,
                messages: {
                  required: 'We need the clients NHI number',
                  maxlength: 'That NHI number is too long',
                  minlength: 'That NHI number is too short'
                }
              },
              expressionProperties: {
                hide: 'model.unknownNhi'
              }
            },
            {
              key: 'unknownNhi',
              type: 'checkbox',
              defaultValue: false,
              templateOptions: {
                placeholder: 'I don\'t know the clients NHI code'
              }
            },
            {
              key: 'firstname',
              type: 'input',
              templateOptions: {
                label: 'First Name',
                required: true,
                messages: {
                  required: 'We need the clients first name'
                }
              },
              expressionProperties: {
                hide: '! model.unknownNhi'
              }
            },
            {
              key: 'familyname',
              type: 'input',
              templateOptions: {
                label: 'Family Name',
                required: true,
                messages: {
                  required: 'We need the clients family name'
                }
              },
              expressionProperties: {
                hide: '! model.unknownNhi'
              }
            },
            {
              key: 'dob',
              type: 'input',
              templateOptions: {
                label: 'Date of Birth',
                required: true,
                type: 'date',
                messages: {
                  required: 'We need the clients dob'
                }
              },
              expressionProperties: {
                hide: '! model.unknownNhi'
              }
            },
            {
              type: 'button',
              templateOptions: {
                label: 'Cancel'
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Next step',
                flow: 'who-two',
                validate: true
              }
            }
          ]
        },
        'who-two': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'Who was hurt?'
              }
            },
            {
              key: 'nhiNumber',
              type: 'input',
              templateOptions: {
                placeholder: 'NHI Number',
                required: true,
                messages: {
                  required: 'We need your NHI number'
                }
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Previous',
                flow: 'who-one',
                validate: false
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Next step',
                flow: 'where-one',
                validate: true
              }
            }
          ]
        },
        'where-one': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'Where did the injury happen?'
              }
            },
            {
              type: 'label',
              templateOptions: {
                label: 'Did the accident or injury happen at work?'
              }
            },
            {
              key: 'isAtWork',
              type: 'radio',
              templateOptions: {
                required: true,
                options: [
                  {
                    name: 'Yes, it did',
                    value: 'yes'
                  },
                  {
                    name: 'No, it didn\'t',
                    value: 'no'
                  }
                ]
              }
            },
            {
              key: 'isAtWorkEmployer',
              //TODO should be autocomplete
              type: 'input',
              templateOptions: {
                placeholder: 'Please add the employer'
              },
              expressionProperties: {
                hide: 'model.isAtWork !== "yes"'
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Previous',
                flow: 'who-two',
                validate: false
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Next step',
                flow: 'where-two',
                validate: true
              }
            }
          ]
        }
      }
    }
  );
});





Template.find({}).remove(function() {

  Template.create(
    {
      name: 'input',
      template: '<md-input-container class="appointment-input"> \
                            <label>{{::to.label}}</label> \
                            <input type="{{::to.type}}" placeholder="{{::to.placeholder}}" ng-model="model[options.key]"/> \
                            <div class="error-message" ng-messages="options.formControl.$error" ng-show="options.formControl.$touched || options.formControl.$submitted"> \
                              <div ng-message="{{::name}}" ng-repeat="(name, message) in ::to.messages track by $index"> \
                                {{::message}} \
                              </div> \
                            </div> \
                         </md-input-container>',
      defaultOptions: {
        templateOptions: {
          type: 'text',
          icon: '/assets/images/ic_blank_24px.svg',
          messages: {
            required: 'This field is required'
          }
        }
      }
    },
    {
      name: 'select',
      template: '<md-icon md-svg-src="{{::to.icon}}"></md-icon> \
                         <md-select ng-model="model[options.key]" placeholder="{{::to.placeholder}}"> \
                            <md-option ng-repeat="option in ::to.options track by $index" value="{{::option.value}}">{{::option.name}}</md-option> \
                         </md-select> \
                         <p ng-show="model[options.key]" class="md-caption ng-hide"><span>{{::to.placeholder}}</span></p> \
                         <p ng-hide="model[options.key]" class="md-caption ng-hide location-select-message"><span ng-show="options.formControl.$submitted">{{::to.messages.required}}</span></p>',
      defaultOptions: {
        templateOptions: {
          optionsFromContent: false,
          icon: '/assets/images/ic_blank_24px.svg',
          messages: {
            required: 'This field is required'
          }
        }
      }
    },
    {
      name: 'radio',
      template: '<md-radio-group ng-model="model[options.key]"> \
                            <md-radio-button ng-repeat="option in ::to.options track by $index" value="{{::option.value}}">{{::option.name}}</md-radio-button> \
                         </md-radio-group>',
      defaultOptions: {
        templateOptions: {
          optionsFromContent: false
        }
      }
    },
    {
      name: 'checkbox',
      template: '<md-checkbox ng-model="model[options.key]" aria-label="Finished?">{{::to.placeholder}}</md-checkbox>',
      defaultOptions: {
        templateOptions: {

        }
      }
    },
    {
      name: 'heading-1',
      template: '<h1>{{::to.heading}}</h1>'
    },
    {
      name: 'label',
      template: '<label>{{::to.label}}</label>'
    },
    {
      name: 'button',
      template: '<md-button class="md-raised" ng-click="$emit(\'formerButtonAction\', $event, to)" type="{{::to.type}}">{{::to.label || options.key}}</md-button>',
      defaultOptions: {
        templateOptions: {
          type: 'button'
        }
      }
    },
    {
      name: 'flowbutton',
      extends: 'button',
      defaultOptions: {
        templateOptions: {
          action: 'flowButtonAction'
        }
      }
    }
  );
});

