'use strict';

var _ = require('lodash');
var Transformation = require('./transformation.model');
/* global -Promise */
var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);

/**
 * EXPORTS
 */
exports.show = show;


/**
 *
 * @param req
 * @param res
 * @returns {*}
 */
function show(req, res) {
  var name = req.params.name;

  if( ! name){
    console.log('No name passed to transformation.show');
    return res.status(400).send();
  }

  return Transformation.findOneAsync({ name: name }, {_id: 0, __v: 0})
    .then(function(transformation){
      if( ! transformation) {
        console.log('transformation not found', name);
        return res.send(404);
      }
      else {
        return createTransformationResponse(transformation)
          .then(function(transformationResponse){
            res.status(200).type('application/javascript').send(transformationResponse);
          })
          .catch(function(error){
            console.log('error finding transformation script', error);
            return res.send(500);
          });
      }
    })
    .catch(function(error){
      console.log('get transformation error', error);
      return res.send(500, error);
    });
}

/**
 *
 * @param transformation
 * @returns {*}
 */
function createTransformationResponse(transformation){

  //TODO we might want to template parts of the scripts - e.g. customise namespace/callback etc
  console.log('found transformation', transformation);

  return fs.readFileAsync(transformation.scriptFilePath, { encoding: 'utf-8' })
    .then(function(transformationScriptFile){
      console.log('found transformation script -- transformationScriptFile.length', transformationScriptFile.length);
      return transformationScriptFile;
    });
}


/*
// Get list of transformations
exports.index = function(req, res) {
  Transformation.find(function (err, transformations) {
    if(err) { return handleError(res, err); }
    return res.json(200, transformations);
  });
};

// Get a single transformation
exports.show = function(req, res) {
  Transformation.findById(req.params.id, function (err, transformation) {
    if(err) { return handleError(res, err); }
    if(!transformation) { return res.send(404); }
    return res.json(transformation);
  });
};

// Creates a new transformation in the DB.
exports.create = function(req, res) {
  Transformation.create(req.body, function(err, transformation) {
    if(err) { return handleError(res, err); }
    return res.json(201, transformation);
  });
};

// Updates an existing transformation in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Transformation.findById(req.params.id, function (err, transformation) {
    if (err) { return handleError(res, err); }
    if(!transformation) { return res.send(404); }
    var updated = _.merge(transformation, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, transformation);
    });
  });
};

// Deletes a transformation from the DB.
exports.destroy = function(req, res) {
  Transformation.findById(req.params.id, function (err, transformation) {
    if(err) { return handleError(res, err); }
    if(!transformation) { return res.send(404); }
    transformation.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

*/