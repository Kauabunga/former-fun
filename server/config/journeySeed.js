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
var _ = require('lodash');



//////////////////////////////////////////////////////////////////////////////////
//                                     ///////////////////////////////////////////
//         TRANSFORMATION              ///////////////////////////////////////////
//                                     ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

//Transformation.find({}).remove(function() {
  Transformation.createAsync(
    {
      name: 'viewJourneyButton',
      version: '1.0',
      scriptFilePath: './server/components/journeyTransformationScripts/viewJourneyButtonV1Transformation.js'
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

//});




//////////////////////////////////////////////////////////////////////////////////
//                                     ///////////////////////////////////////////
//              FORM                   ///////////////////////////////////////////
//                                     ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Form.find({name: 'journey'}).remove(function() {
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
              type: 'button',
              templateOptions: {
                label: 'View journey',
                targetState: 'journeyview',
                targetStateIdParam: 'currentId',
                currentStateIdParam: 'currentId'
              }
            },
            {
              key: 'journeyTitle',
              type: 'input',
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
                    type: 'input',
                    templateOptions: {
                      label: 'Step Title',
                      required: true
                    }
                  },
                  {
                    key: 'stepBlurb',
                    type: 'input',
                    templateOptions: {
                      label: 'Step Blurb',
                      required: false
                    }
                  },
                  {
                    key: 'stepTime',
                    type: 'input',
                    templateOptions: {
                      label: 'Time of event',
                      required: false
                    }
                  },
                  {
                    key: 'stepImage',
                    type: 'input',
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
    }
  );
});

