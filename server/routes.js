/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/journeys', require('./api/journey'));
  app.use('/api/mocks', require('./api/mock'));
  app.use('/api/transformations', require('./api/transformation'));
  app.use('/api/forms', require('./api/form'));
  app.use('/api/templates', require('./api/template'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
