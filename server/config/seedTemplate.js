/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Template = require('../api/template/template.model');


//////////////////////////////////////////////////////////////////////////////////
//                                     ///////////////////////////////////////////
//              TEMPLATES              ///////////////////////////////////////////
//                                     ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Template.find({}).remove(function() {

  //TODO need to transform these templates to validate their api with apiCheck

  Template.create(
    {
      name: 'materialinput',
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
                      ' placeholder="{{::to.placeholder}}">' +
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
                  '<md-chips ng-model="model[options.key]" md-autocomplete-snap md-require-match>' +
                    '<md-autocomplete ' +
                          ' md-autofocus="false"' +
                          ' md-selected-item="to.currentSelected"' +
                          ' md-search-text-change="to.searchTextChange(to.searchText)"' +
                          ' md-search-text="to.searchText"' +
                          ' md-selected-item-change="to.selectedItemChange(item)"' +
                          ' md-items="item in to.querySearch(to.searchText)"' +
                          ' md-item-text="item"' +
                          ' placeholder="{{::to.placeholder}}">' +
                      '<span md-highlight-text="to.searchText">{{item}}</span>' +
                    '</md-autocomplete>' +
                    '<md-chip-template>' +
                      '<span>' +
                        '<strong>{{$chip}}</strong>' +
                      '</span>' +
                    '</md-chip-template>' +
                  '</md-chips>' +
                  '<input style="display: none;" ng-model="model[options.key][0]" ng-required="to.required" />' +
                  '<div class="error-message" ng-messages="options.formControl[0].$error" ng-show="options.formControl[0].$touched || options.formControl[0].$submitted">' +
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
          placeholder: 'Start typing to search for the address',
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
          placeholder: 'ICD 10',
          messages: {
            required: 'Need to enter an icd 10'
          }
        }
      }
    },
    {
      name: 'date',
      extends: 'materialinput',
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



  Template.create(
    {
      name: 'inlinetitle-1',
      template: '<h1 ng-focus="isFocused = true" ng-blur="isFocused = false" ng-class="{\'is-focused\': isFocused}" class="inlinetitle {{to.className}}}">' +
                  '<input ng-model="model[options.key]" />' +
                '</h1>',
      defaultOptions: {
        defaultValue: 'Default title value',
        templateOptions: {

        }
      }
    },
    {
      name: 'inlinetitle-2',
      template: '<h2 ng-focus="isFocused = true" ng-blur="isFocused = false" ng-class="{\'is-focused\': isFocused}" class="inlinetitle {{to.className}}}">' +
                  '<input ng-model="model[options.key]" />' +
                '</h2>',
      defaultOptions: {
        defaultValue: 'Default title value',
        templateOptions: {

        }
      }
    },
    {
      name: 'inlinetitle-3',
      template: '<h3 ng-focus="isFocused = true" ng-blur="isFocused = false" ng-class="{\'is-focused\': isFocused}" class="inlinetitle {{to.className}}}">' +
                  '<input ng-model="model[options.key]" />' +
                '</h3>',
      defaultOptions: {
        defaultValue: 'Default title value',
        templateOptions: {

        }
      }
    },
    {
      name: 'inlineparagraph',
      template: '<p ng-focus="isFocused = true" ng-blur="isFocused = false" ng-class="{\'is-focused\': isFocused}" class="inlineparagraph {{to.className}}}">' +
                  '<textarea ng-model="model[options.key]" />' +
                '</p>',
      defaultOptions: {
        defaultValue: 'Default title value',
        templateOptions: {

        }
      }
    }
  )


});
