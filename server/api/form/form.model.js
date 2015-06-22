'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* global -Promise */
var Promise = require('bluebird');


var FormSchema = new Schema({

  name: {
    type: String,
    required: true,
    unique: true
  },
  version: {
    type: String,
    required: true
  },
  defaultSection: String,
  transformationModules: {},
  sections: {}

});

var FormModel = mongoose.model('Form', FormSchema);

Promise.promisifyAll(FormModel);
Promise.promisifyAll(FormModel.prototype);

module.exports = FormModel;


