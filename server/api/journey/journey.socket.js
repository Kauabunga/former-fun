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

        var updateId = updateJourney._updateId;

        if( ! journey ){
          Journey.create(updateJourney);
        }
        else {
          _.merge(journey, updateJourney);
          console.log('journey', journey._formId);
          //TODO This isn't triggering our post save hook????
          journey.save(function(){
            console.log('saving journey', journey._formId);
            journey._updateId = updateId;
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
