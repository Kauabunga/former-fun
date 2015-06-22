'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* global -Promise */
var Promise = require('bluebird');


var TransformationSchema = new Schema({
  name: {
    type:String,
    required: true,
    unique: true
  },
  version: {
    type: String,
    required: true,
    unique: true
  },
  scriptFilePath: {
    type: String,
    required: true
  },
  scriptFileContent: {
    type: String
  }
});


//TODO on new -> add skeleton scriptFileContent


var TransformationModel = mongoose.model('Transformation', TransformationSchema);

Promise.promisifyAll(TransformationModel);
Promise.promisifyAll(TransformationModel.prototype);

module.exports = TransformationModel;
