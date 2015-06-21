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
    },
    {
      name: 'address',
      scriptFilePath: './server/components/transformationScripts/addressTransformation.js'
    }
  );
});


Form.find({}).remove(function() {
  Form.create(
    {
      name: 'acc45',
      defaultSection: 'who-one',
      transformationModules: {
        baseurl: '/api/transformations',
        modules: ['nhiNumber', 'address']
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
                label: 'NHI Code',
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
                placeholder: 'I don\'t know an NHI code'
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
                label: 'Cancel',
                className: 'cancel-button'
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Next step',
                className: 'md-primary next-button',
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
              key: 'firstname',
              type: 'input',
              templateOptions: {
                label: 'First Name',
                required: true,
                messages: {
                  required: 'We need the clients First name'
                }
              }
            },
            {
              key: 'familyname',
              type: 'input',
              templateOptions: {
                label: 'Family Name',
                required: true,
                messages: {
                  required: 'We need the clients Family name'
                }
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
              }
            },
            {
              key: 'address',
              type: 'address',
              templateOptions: {
                label: 'Address',
                required: true,
                messages: {
                  required: 'We need the clients Address'
                }
              }
            },
            {
              key: 'gender',
              type: 'select',
              templateOptions: {
                placeholder: 'Gender',
                required: true,
                options: [
                  {
                    name: 'Male',
                    value: 'male'
                  },
                  {
                    name: 'Female',
                    value: 'female'
                  },
                  {
                    name: 'Unknown',
                    value: 'unknown'
                  },
                  {
                    name: 'Indeterminate',
                    value: 'indeterminate'
                  }
                ],
                messages: {
                  required: 'We need the clients Gender'
                }
              }
            },
            {
              key: 'ethnicity',
              type: 'select',
              templateOptions: {
                placeholder: 'Ethnicity',
                required: true,
                options: [
                  {
                    name: 'NZ',
                    value: 'nz'
                  }

                ],
                messages: {
                  required: 'We need the clients Ethnicity'
                }
              }
            },
            {
              key: 'residencestatus',
              type: 'select',
              templateOptions: {
                placeholder: 'Residence Status',
                required: true,
                options: [
                  {
                    name: 'Citizen',
                    value: 'citizen'
                  }
                ],
                messages: {
                  required: 'We need the clients Residence Status'
                }
              }
            },
            {
              key: 'medicalwarning',
              type: 'textarea',
              templateOptions: {
                label: 'Medical warning',
                required: false,
                messages: {
                  required: 'We need the clients Family name'
                }
              }
            },
            {
              key: 'donor',
              type: 'select',
              templateOptions: {
                placeholder: 'Donor',
                required: true,
                options: [
                  {
                    name: 'Yes',
                    value: 'yes'
                  },
                  {
                    name: 'No',
                    value: 'no'
                  }
                ],
                messages: {
                  required: 'We need to know if the client is a donor'
                }
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Previous',
                className: 'cancel-button',
                flow: 'who-one',
                validate: false
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Next step',
                className: 'md-primary next-button',
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
              type: 'address',
              templateOptions: {
                required: true,
                label: 'Please add the employer'
              },
              expressionProperties: {
                hide: 'model.isAtWork !== "yes"'
              },
              hideExpression: 'model.isAtWork !== "yes"'
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Previous',
                className: 'cancel-button',
                flow: 'who-two',
                validate: false
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Next step',
                className: 'md-primary next-button',
                flow: 'where-two',
                validate: true
              }
            }
          ]
        },
        'where-two': {
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
                label: 'Did the accident or injury happen in New Zealand?'
              }
            },
            {
              key: 'isInNewZealand',
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
              key: 'injuryLocation',
              type: 'address',
              templateOptions: {
                required: true,
                label: 'What was the location?'
              },
              expressionProperties: {
                hide: '! model.isInNewZealand'
              },
              hideExpression: '! model.isInNewZealand'
            },
            {
              key: 'scene',
              type: 'input',
              templateOptions: {
                label: 'What was the scene?',
                required: true,
                messages: {
                  required: 'We need to know the scene of the accident'
                }
              },
              expressionProperties: {
                hide: '! model.isInNewZealand'
              },
              hideExpression: '! model.isInNewZealand'
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Previous',
                className: 'cancel-button',
                flow: 'where-one',
                validate: false
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Next step',
                className: 'md-primary next-button',
                flow: 'when-one',
                validate: true
              }
            }
          ]
        },
        'when-one': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'When did the injury happen?'
              }
            },
            {
              key: 'injurydate',
              type: 'input',
              templateOptions: {
                label: 'What was the date?',
                required: true,
                type: 'date',
                messages: {
                  required: 'Please enter the date the injury occurred'
                }
              }
            },
            {
              type: 'flowbutton',
              templateOptions: {
                label: 'Previous',
                className: 'cancel-button',
                flow: 'where-two',
                validate: false
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
      template: '<md-input-container class="appointment-input">' +
                    '<label>{{::to.label}}</label>' +
                    '<input type="{{::to.type}}" placeholder="{{::to.placeholder}}" ng-model="model[options.key]"/>' +
                    '<div class="error-message" ng-messages="options.formControl.$error" ng-show="options.formControl.$touched || options.formControl.$submitted">' +
                      '<div ng-message="{{::name}}" ng-repeat="(name, message) in ::to.messages track by $index">' +
                        '{{::message}}' +
                      '</div>' +
                    '</div>' +
                 '</md-input-container>',
      defaultOptions: {
        templateOptions: {
          type: 'text',
          required: false,
          messages: {
            required: 'This field is required'
          }
        }
      }
    },
    {
      name: 'textarea',
      template: '<md-input-container class="appointment-input">' +
                  '<label>{{::to.label}}</label>' +
                  '<textarea placeholder="{{::to.placeholder}}" ng-model="model[options.key]"/>' +
                  '<div class="error-message" ng-messages="options.formControl.$error" ng-show="options.formControl.$touched || options.formControl.$submitted">' +
                    '<div ng-message="{{::name}}" ng-repeat="(name, message) in ::to.messages track by $index">' +
                      '{{::message}}' +
                    '</div>' +
                  '</div>' +
                '</md-input-container>',
      defaultOptions: {
        templateOptions: {
          required: false,
          messages: {
            required: 'This field is required'
          }
        }
      }
    },
    {
      name: 'select',
      template: '<md-select ng-model="model[options.key]" placeholder="{{::to.placeholder}}">' +
                    '<md-option ng-repeat="option in ::to.options track by $index" value="{{::option.value}}">{{::option.name}}</md-option>' +
                 '</md-select>' +
                 '<p ng-show="model[options.key]" class="md-caption ng-hide"><span>{{::to.placeholder}}</span></p>' +
                 '<p ng-hide="model[options.key]" class="md-caption ng-hide location-select-message"><span ng-show="options.formControl.$submitted">{{::to.messages.required}}</span></p>',
      defaultOptions: {
        templateOptions: {
          required: false,
          messages: {
            required: 'This field is required'
          }
        }
      }
    },
    {
      name: 'autocomplete',
      template: '<div>' +
                    '<md-autocomplete ' +
                    ' md-autofocus="false"' +
                    ' md-no-cache="to.noCache"' +
                    ' md-selected-item="model[options.key]"' +
                    ' md-search-text-change="to.searchTextChange(to.searchText)"' +
                    ' md-search-text="to.searchText"' +
                    ' md-selected-item-change="to.selectedItemChange(item)"' +
                    ' md-items="item in to.querySearch(to.searchText)"' +
                    ' md-item-text="item"' +
                    ' md-min-length="3"' +
                    ' md-floating-label="{{::to.label}}"' +
                    ' placeholder="Start typing to search for the address">' +
                      '<md-item-template>' +
                        '<span md-highlight-text="to.searchText" md-highlight-flags="^i">{{item}}</span>' +
                      '</md-item-template>' +
                      '<md-not-found>' +
                        'No matches found for "{{to.searchText}}".' +
                      '</md-not-found>' +
                  '</md-autocomplete>' +
                  '<input style="display: none;" ng-model="model[options.key]" ng-required="to.required" />' +
                  '<div class="error-message" ng-messages="options.formControl.$error" ng-show="options.formControl.$touched || options.formControl.$submitted">' +
                    '<div ng-message="{{::name}}" ng-repeat="(name, message) in to.messages track by $index">' +
                      '{{::message}}' +
                    '</div>' +
                  '</div>' +
                '</div>',
      defaultOptions: {
        templateOptions: {
          required: false,
          messages: {
            required: 'This field is required'
          }
        }
      }
    },
    {
      name: 'radio',
      template: '<md-radio-group ng-model="model[options.key]">' +
                            '<md-radio-button ng-repeat="option in ::to.options track by $index" value="{{::option.value}}">{{::option.name}}</md-radio-button>' +
                         '</md-radio-group>',
      defaultOptions: {
        templateOptions: {
          required: false
        }
      }
    },
    {
      name: 'checkbox',
      template: '<md-checkbox ng-model="model[options.key]" aria-label="Finished?">{{::to.placeholder}}</md-checkbox>',
      defaultOptions: {
        templateOptions: {
          required: false
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
      template: '<md-button class="md-raised {{::to.className}}" ng-click="$emit(\'formerButtonAction\', $event, to)" type="{{::to.type}}">{{::to.label || options.key}}</md-button>',
      defaultOptions: {
        templateOptions: {
          className: 'button',
          required: false,
          type: 'button'
        }
      }
    },
    {
      name: 'address',
      extends: 'autocomplete',
      defaultOptions: {
        templateOptions: {
          label: 'Address',
          messages: {
            required: 'Need to enter an address'
          }
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

