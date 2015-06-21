'use strict';

var _ = require('lodash');
var Template = require('./template.model');

// Get list of templates
exports.index = function(req, res) {
  Template.find({}, {_id: 0, __v: 0}, function (err, templates) {
    if(err) { return handleError(res, err); }

    //Need to ensure that templates that are extending others are ordered last
    templates.sort(function(a, b){
      return a.extends;
    });

    return res.status(200).json(templates);
  });
};



/*
// Get a single template
exports.show = function(req, res) {
  Template.findById(req.params.id, function (err, template) {
    if(err) { return handleError(res, err); }
    if(!template) { return res.status(404).send('Not Found'); }
    return res.json(template);
  });
};

// Creates a new template in the DB.
exports.create = function(req, res) {
  Template.create(req.body, function(err, template) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(template);
  });
};

// Updates an existing template in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Template.findById(req.params.id, function (err, template) {
    if (err) { return handleError(res, err); }
    if(!template) { return res.status(404).send('Not Found'); }
    var updated = _.merge(template, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(template);
    });
  });
};

// Deletes a template from the DB.
exports.destroy = function(req, res) {
  Template.findById(req.params.id, function (err, template) {
    if(err) { return handleError(res, err); }
    if(!template) { return res.status(404).send('Not Found'); }
    template.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
*/