/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Template = require('../api/template/template.model');
var Transformation = require('../api/transformation/transformation.model');
var Form = require('../api/form/form.model');

/* global -Promise */
var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);




//////////////////////////////////////////////////////////////////////////////////
//                                     ///////////////////////////////////////////
//         TRANSFORMATION              ///////////////////////////////////////////
//                                     ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Transformation.find({}).remove(function() {
  Transformation.createAsync(
    {
      name: 'nhiNumber',
      scriptFilePath: './server/components/transformationScripts/nhiNumberTransformation.js'
    },
    {
      name: 'address',
      scriptFilePath: './server/components/transformationScripts/addressTransformation.js'
    },
    {
      name: 'date',
      scriptFilePath: './server/components/transformationScripts/dateTransformation.js'
    },
    {
      name: 'injuryDate',
      scriptFilePath: './server/components/transformationScripts/injuryDateTransformation.js'
    }
  ).then(function(transformations){

      //Load script files into data base
      transformations.map(function(transformation){
        fs.readFileAsync(transformation.scriptFilePath, { encoding: 'utf-8' })
          .then(function(transformationScriptFile){
            console.log('found transformation script -- transformationScriptFile.length', transformationScriptFile.length);

            //TODO should minify scripts
            transformation.scriptFileContent = transformationScriptFile;
            transformation.save();
          })
          .catch(function(error){
            console.log('error fetching transformation script', error);
          });
      });
  });

});




//////////////////////////////////////////////////////////////////////////////////
//                                     ///////////////////////////////////////////
//              FORM                   ///////////////////////////////////////////
//                                     ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Form.find({}).remove(function() {
  Form.create(
    {
      name: 'acc45',
      defaultSection: 'who-one',
      transformationModules: {
        baseurl: '/api/transformations',
        modules: ['nhiNumber', 'address', 'date', 'injuryDate']
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
              },
              hideExpression: 'model.unknownNhi'
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
              },
              hideExpression: '! model.unknownNhi'
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
              },
              hideExpression: '! model.unknownNhi'
            },
            {
              key: 'dob',
              type: 'date',
              templateOptions: {
                label: 'Date of Birth',
                required: true,
                messages: {
                  required: 'We need the clients dob'
                }
              },
              expressionProperties: {
                hide: '! model.unknownNhi'
              },
              hideExpression: '! model.unknownNhi'
            },
            {
              type: 'button',
              templateOptions: {
                label: 'Cancel',
                className: 'cancel-button'
              }
            },
            {
              type: 'nextflowbutton',
              templateOptions: {
                flow: 'who-two'
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
              type: 'date',
              templateOptions: {
                label: 'Date of Birth',
                required: true,
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
                  { value: '11', name: 'NZ European/Paheka'},
                  { value: '12', name: 'Other European'},
                  { value: '21', name: 'NZ Maori'},
                  { value: '32', name: 'Cook Island Maori'},
                  { value: '33', name: 'Tongan'},
                  { value: '34', name: 'Niuean'},
                  { value: '36', name: 'Fijian'},
                  { value: '37', name: 'Other Pacific'},
                  { value: '41', name: 'South East Asian'},
                  { value: '43', name: 'Indian'},
                  { value: '44', name: 'Other Asian'},
                  { value: '42', name: 'Chinese'},
                  { value: '31', name: 'Samoan'},
                  { value: '35', name: 'Tokelauan'},
                  { value: '61', name: 'Other ethnicity'},
                  { value: '95', name: 'I\'d prefer not to say'}
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
                required: false
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
              type: 'previousflowbutton',
              templateOptions: {
                flow: 'who-one'
              }
            },
            {
              type: 'nextflowbutton',
              templateOptions: {
                flow: 'where-one'
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
              type: 'previousflowbutton',
              templateOptions: {
                flow: 'who-two'
              }
            },
            {
              type: 'nextflowbutton',
              templateOptions: {
                flow: 'where-two'
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
                ],
                messages: {
                  required: 'We need to know if the injury happened in New Zealand'
                }
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
              type: 'previousflowbutton',
              templateOptions: {
                flow: 'where-one'
              }
            },
            {
              type: 'nextflowbutton',
              templateOptions: {
                flow: 'when-one'
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
              key: 'setInjuryDateToToday',
              type: 'button',
              templateOptions: {
                action: 'setInjuryDateToToday',
                label: 'Today'
              }
            },
            {
              key: 'setInjuryDateToYesterday',
              type: 'button',
              templateOptions: {
                action: 'setInjuryDateToYesterday',
                label: 'Yesterday'
              }
            },
            {
              key: 'injuryDate',
              type: 'date',
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
              type: 'previousflowbutton',
              templateOptions: {
                flow: 'where-two'
              }
            },
            {
              type: 'nextflowbutton',
              templateOptions: {
                flow: 'what-one'
              }
            }
          ]
        },
        'what-one': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'What happened?'
              }
            },
            {
              type: 'label',
              templateOptions: {
                label: 'Did the accident or injury involve a moving vehicle on a public road?'
              }
            },
            {
              key: 'isMovingVehicle',
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
                ],
                messages: {
                  required: 'We need to know if the injury involved a moving vehicle'
                }
              }
            },
            {
              type: 'label',
              templateOptions: {
                label: 'How was the injury caused? (e.g. cleaning kitchen, slipped on wet floor and hit head on table)'
              },
              expressionProperties: {
                hide: '! model.isMovingVehicle'
              },
              hideExpression: '! model.isMovingVehicle'
            },
            {
              key: 'injuryCause',
              type: 'textarea',
              templateOptions: {
                label: 'Add description',
                required: true,
                messages: {
                  required: 'We need to know how the injury was caused'
                }
              },
              expressionProperties: {
                hide: '! model.isMovingVehicle'
              },
              hideExpression: '! model.isMovingVehicle'
            },
            {
              type: 'previousflowbutton',
              templateOptions: {
                flow: 'when-one'
              }
            },
            {
              type: 'nextflowbutton',
              templateOptions: {
                flow: 'what-two'
              }
            }
          ]
        },
        'what-two': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'What is your diagnosis?'
              }
            },
            {
              key: 'diagnosis',
              type: 'icd10',
              templateOptions: {
                required: true,
                label: 'Diagnosis?'
              }
            },
            {
              type: 'previousflowbutton',
              templateOptions: {
                flow: 'what-one'
              }
            },
            {
              type: 'nextflowbutton',
              templateOptions: {
                flow: 'consult-one'
              }
            }
          ]
        },
        'consult-one': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'Does the client need to be referred?'
              }
            },
            {
              key: 'needsReferral',
              type: 'radio',
              templateOptions: {
                required: true,
                options: [
                  {
                    name: 'Yes, they do',
                    value: 'yes'
                  },
                  {
                    name: 'No, they don\'t',
                    value: 'no'
                  }
                ],
                messages: {
                  required: 'We need to know if the client needs referring'
                }
              }
            },
            {
              type: 'previousflowbutton',
              templateOptions: {
                flow: 'what-two'
              }
            },
            {
              type: 'nextflowbutton',
              templateOptions: {
                flow: 'consult-two'
              }
            }
          ]
        },
        'consult-two': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'Does the client require further assistance?'
              }
            },
            {
              key: 'notifyClient',
              type: 'checkbox',
              defaultValue: false,
              templateOptions: {
                placeholder: 'ACC should notify the client'
              }
            },
            {
              type: 'label',
              templateOptions: {
                label: 'How should ACC notify the client?'
              },
              expressionProperties: {
                hide: '! model.notifyClient'
              },
              hideExpression: '! model.notifyClient'
            },
            {
              key: 'contactByText',
              type: 'checkbox',
              templateOptions: {
                defaultValue: false,
                placeholder: 'Text Message'
              },
              expressionProperties: {
                hide: '! model.notifyClient'
              },
              hideExpression: '! model.notifyClient'
            },
            {
              key: 'contactByTextNumber',
              type: 'input',
              templateOptions: {
                required: true,
                label: 'Cell phone number'
              },
              expressionProperties: {
                hide: '! model.contactByText || ! model.notifyClient'
              },
              hideExpression: '! model.contactByText || ! model.notifyClient'
            },
            {
              key: 'contactByEmail',
              type: 'checkbox',
              templateOptions: {
                defaultValue: false,
                placeholder: 'Email'
              },
              expressionProperties: {
                hide: '! model.notifyClient'
              },
              hideExpression: '! model.notifyClient'
            },
            {
              key: 'contactByEmailAddress',
              type: 'input',
              templateOptions: {
                required: true,
                type: 'email',
                label: 'Email address'
              },
              expressionProperties: {
                hide: '! model.contactByEmail || ! model.notifyClient'
              },
              hideExpression: '! model.contactByEmail || ! model.notifyClient'
            },
            {
              key: 'notifyMyself',
              type: 'checkbox',
              defaultValue: false,
              templateOptions: {
                placeholder: 'ACC should call me'
              }
            },
            {
              type: 'previousflowbutton',
              templateOptions: {
                flow: 'consult-one'
              }
            },
            {
              type: 'nextflowbutton',
              templateOptions: {
                flow: 'consult-three'
              }
            }
          ]
        },
        'consult-three': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'How is the client\'s work capacity?'
              }
            },
            {
              type: 'label',
              templateOptions: {
                label: 'Is the client able to continue normal work?'
              }
            },
            {
              key: 'continueWork',
              type: 'radio',
              templateOptions: {
                required: true,
                options: [
                  {
                    name: 'Yes, they can',
                    value: 'yes'
                  },
                  {
                    name: 'No, they can\'t',
                    value: 'no'
                  }
                ],
                messages: {
                  required: 'We need to know if the client can continue work'
                }
              }
            },
            {
              type: 'previousflowbutton',
              templateOptions: {
                flow: 'consult-two'
              }
            },
            {
              type: 'nextflowbutton',
              templateOptions: {
                flow: 'confirm'
              }
            }
          ]
        },
        'confirm': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'Please confirm the information is correct and submit the claim.'
              }
            },
            {
              type: 'previousflowbutton',
              templateOptions: {
                flow: 'consult-three'
              }
            },
            {
              type: 'button',
              templateOptions: {
                label: 'Submit ACC45',
                type: 'submit',
                className: 'md-primary next-button',
                validate: true
              }
            }
          ]
        }
      }
    }
  );
});





//////////////////////////////////////////////////////////////////////////////////
//                                     ///////////////////////////////////////////
//              TEMPLATES              ///////////////////////////////////////////
//                                     ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Template.find({}).remove(function() {

  //TODO need to transform these templates to validate their api with apiCheck

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
                  '<textarea placeholder="{{::to.placeholder}}" ng-model="model[options.key]"></textarea>' +
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
                 '<p ng-hide="model[options.key]" class="md-caption error-message ng-hide"><span ng-show="options.formControl.$submitted">{{::to.messages.required}}</span></p>',
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
                    ' md-min-length="2"' +
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
      name: 'chips',
      template: '<div>' +
                  '<h4>TODO CHIPS</h4>' +
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
                 '</md-radio-group>' +
                 '<div class="error-message" ng-messages="options.formControl.$error" ng-show="options.formControl.$touched || options.formControl.$submitted">' +
                   '<div ng-message="{{::name}}" ng-repeat="(name, message) in to.messages track by $index">' +
                      '{{::message}}' +
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
      template: '<md-button class="md-raised {{::to.className}}" ng-click="to.formerActionButton($event, this, to)" type="{{::to.type}}">{{::to.label || options.key}}</md-button>',
      defaultOptions: {
        templateOptions: {
          className: 'button',
          required: false,
          type: 'button'
        }
      }
    },
    {
      name: 'flowbutton',
      template: '<md-button class="md-raised {{::to.className}}" ng-click="$emit(\'formerButtonAction\', $event, to)" type="{{::to.type}}">{{::to.label || options.key}}</md-button>',
      defaultOptions: {
        templateOptions: {
          action: 'flowButtonAction',
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
      name: 'businessname',
      extends: 'autocomplete',
      defaultOptions: {
        templateOptions: {
          label: 'Business name',
          messages: {
            required: 'Need to enter a business name'
          }
        }
      }
    },
    {
      name: 'icd10',
      extends: 'chips',
      defaultOptions: {
        templateOptions: {
          label: 'ICD 10',
          messages: {
            required: 'Need to enter an icd 10'
          }
        }
      }
    },
    {
      name: 'date',
      extends: 'input',
      defaultOptions: {
        templateOptions: {
          type: 'date'
        }
      }
    },
    {
      name: 'previousflowbutton',
      extends: 'flowbutton',
      defaultOptions: {
        templateOptions: {
          label: 'Previous',
          className: 'cancel-button',
          validate: false
        }
      }
    },
    {
      name: 'nextflowbutton',
      extends: 'flowbutton',
      defaultOptions: {
        templateOptions: {
          label: 'Next step',
          type: 'submit',
          className: 'md-primary next-button',
          validate: true
        }
      }
    }
  );
});

