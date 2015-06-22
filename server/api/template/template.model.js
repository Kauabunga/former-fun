'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* global -Promise */
var Promise = require('bluebird');



var TemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  extends: String,
  template: {},
  defaultOptions: {}
});

var TemplateModel = mongoose.model('Template', TemplateSchema);

Promise.promisifyAll(TemplateModel);
Promise.promisifyAll(TemplateModel.prototype);

module.exports = TemplateModel;
