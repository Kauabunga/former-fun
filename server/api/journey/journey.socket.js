/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Journey = require('./journey.model');
var _ = require('lodash');

exports.register = function(socket, socketio) {

  Journey.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Journey.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });




  socket.on('journey:update', function(updateJourney){

    console.log('journey:update event', updateJourney._id, updateJourney._formId);

    Journey.findOneAsync({_formId: updateJourney._formId})
      .then(function(journey){

        if( ! journey ){
          Journey.create(updateJourney);
        }
        else {

          journey.journeyTitle = updateJourney.journeyTitle;
          journey.steps = updateJourney.steps;

          journey.save(function(error, updatedJourney){
            console.log('saved journey', journey._formId);
            socketio.emit('journey:updated', journey);
          });
        }

      })
      .catch(function(error){
        console.log('error updating journey', error);
      });
  });

};

function onSave(socket, doc, cb) {
  socket.emit('journey:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('journey:remove', doc);
}
