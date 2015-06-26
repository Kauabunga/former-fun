'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/* global -Promise */
var Promise = require('bluebird');


var JourneySchema = new Schema({
  _formId: String,
  journeyTitle: String,
  isShared: Boolean,
  steps: [
    {
      stepBlurb: String,
      stepDoing: String,
      stepFeeling: String,
      stepImage: String,
      stepThinking: String,
      stepTime: String,
      stepTitle: String
    }
  ]
});



var JourneyModel = mongoose.model('Journey', JourneySchema);

Promise.promisifyAll(JourneyModel);
Promise.promisifyAll(JourneyModel.prototype);

module.exports = JourneyModel;
