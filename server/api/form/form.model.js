'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FormSchema = new Schema({

  defaultSection: String,
  sections: {}

});

module.exports = mongoose.model('Form', FormSchema);
