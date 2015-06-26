/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';



var Journey = require('../api/journey/journey.model');
var Template = require('../api/template/template.model');
var Transformation = require('../api/transformation/transformation.model');
var Form = require('../api/form/form.model');

/* global -Promise */
var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);
var _ = require('lodash');



Journey.find({}).remove(function(){


});


//////////////////////////////////////////////////////////////////////////////////
//                                     ///////////////////////////////////////////
//         TRANSFORMATION              ///////////////////////////////////////////
//                                     ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Transformation.find({name: 'viewJourneyButton'}).remove(function() {
Transformation.find({name: 'journeyImage'}).remove(function() {
Transformation.find({name: 'journeyIndexButton'}).remove(function() {

  Transformation.createAsync(
    {
      name: 'viewJourneyButton',
      version: '1.0',
      scriptFilePath: './server/components/journeyTransformationScripts/viewJourneyButtonV1Transformation.js'
    },
    {
      name: 'journeyImage',
      version: '1.0',
      scriptFilePath: './server/components/journeyTransformationScripts/journeyImageV1Transformation.js'
    },
    {
      name: 'journeyIndexButton',
      version: '1.0',
      scriptFilePath: './server/components/journeyTransformationScripts/journeyIndexButtonV1Transformation.js'
    }
  ).then(function(transformations){

      transformations = [].concat(transformations);

      //Load script files into data base
      _.map(transformations, function(transformation){
        console.log(transformation);
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
  })
    .catch(function(error){
      console.log('Error creating transformations - probably duplicate?');
    });

});
});
});




//////////////////////////////////////////////////////////////////////////////////
//                                     ///////////////////////////////////////////
//              FORM                   ///////////////////////////////////////////
//                                     ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Form.find({name: 'journey'}).remove(function() {
Form.find({name: 'journeyinline'}).remove(function() {
  Form.create(
    {
      name: 'journey',
      version: '1.0',
      defaultSection: 'start',
      transformationModules: {
        baseurl: '/api/transformations',
        modules: ['date', 'viewJourneyButton']
      },
      sections: {
        'start': {
          fields: [
            {
              type: 'heading-1',
              templateOptions: {
                heading: 'Create a customer journey'
              }
            },
            {
              key: 'viewJourney',
              type: 'viewbutton',
              templateOptions: {
                label: 'View presentation',
                className: 'view-journey-button journey-presentation',
                targetState: 'journeyview',
                targetStateIdParam: 'currentId',
                currentStateIdParam: 'currentId'
              }
            },
            {
              key: 'viewInlineJourney',
              type: 'viewbutton',
              templateOptions: {
                label: 'View inline',
                className: 'view-journey-button journey-inline',
                targetState: 'journeyinline',
                targetStateIdParam: 'currentId',
                currentStateIdParam: 'currentId'
              }
            },
            {
              key: 'journeyTitle',
              type: 'materialinput',
              templateOptions: {
                label: 'Journey Title',
                required: true
              }
            },
            {
              type: 'repeatSection',
              key: 'steps',
              defaultValue: [{stepTitle: '', stepImage: '', stepThinking: '', stepFeeling: '', stepDoing: ''}],
              templateOptions: {
                btnText: 'Add another step',
                fields: [
                  {
                    type: 'label',
                    templateOptions: {
                      label: 'Customer step'
                    }
                  },
                  {
                    key: 'stepTitle',
                    type: 'materialinput',
                    templateOptions: {
                      label: 'Step Title',
                      required: true
                    }
                  },
                  {
                    key: 'stepBlurb',
                    type: 'materialinput',
                    templateOptions: {
                      label: 'Step Blurb',
                      required: false
                    }
                  },
                  {
                    key: 'stepTime',
                    type: 'materialinput',
                    templateOptions: {
                      label: 'Time of event',
                      required: false
                    }
                  },
                  {
                    key: 'stepImage',
                    type: 'materialinput',
                    templateOptions: {
                      label: 'Step Image Url',
                      required: true
                    }
                  },
                  {
                    key: 'stepThinking',
                    type: 'textarea',
                    templateOptions: {
                      label: 'Thinking'
                    }
                  },
                  {
                    key: 'stepFeeling',
                    type: 'textarea',
                    templateOptions: {
                      label: 'Feeling'
                    }
                  },
                  {
                    key: 'stepDoing',
                    type: 'textarea',
                    templateOptions: {
                      label: 'Doing'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    },
    {
      name: 'journeyinline',
      version: '1.0',
      defaultSection: 'start',
      transformationModules: {
        baseurl: '/api/transformations',
        modules: ['date', 'journeyImage', 'journeyIndexButton']
      },
      sections: {
        'start': {
          fields: [
            {
              key: 'journeyTitle',
              type: 'inlinetitle-1',
              defaultValue: 'Customer journey title',
              templateOptions: {
                className: 'journey-title',
                heading: 'Create a customer journey'
              }
            },
            {
              type: 'repeatJourneyStep',
              key: 'steps',
              defaultValue: [{stepTitle: 'Fill out the step title ...', stepThinking: 'Default thinking', stepFeeling: 'Default feeling', stepDoing: 'Default doing'}],
              templateOptions: {
                className: 'step-container',
                fields: [
                  {
                    type: 'journeyIndex',
                    templateOptions: {
                      className: 'journey-index'
                    }
                  },
                  {
                    key: 'stepImage',
                    type: 'journeyImage',
                    templateOptions: {
                      className: 'img-mask',
                      formerActionButton: 'DECORATED BY TRANSFORMATIONS'
                    }
                  },
                  {
                    key: 'stepTitle',
                    type: 'inlinetitle-2',
                    defaultValue: 'Default step title',
                    templateOptions: {
                      label: 'Step Title',
                      className: 'center'
                    }
                  },
                  {
                    key: 'stepBlurb',
                    type: 'inlineparagraph',
                    defaultValue: 'Default step blurb',
                    templateOptions: {
                      label: 'Step Blurb',
                      className: 'step-blurb center'
                    }
                  },
                  {
                    key: 'stepTime',
                    type: 'inlineparagraph',
                    defaultValue: 'Default step time',
                    templateOptions: {
                      label: 'Time of event',
                      className: 'step-time center'
                    }
                  },
                  {
                    type: 'journeyEmotions',
                    key: 'journeyEmotions',
                    templateOptions: {
                      fields: [
                        {
                          key: 'stepThinking',
                          label: 'Thinking'
                        },
                        {
                          key: 'stepFeeling',
                          label: 'Feeling'
                        },
                        {
                          key: 'stepDoing',
                          label: 'Doing'
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  );
});
});

