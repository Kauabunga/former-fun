/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Transformation = require('./transformation.model');

exports.register = function(socket) {
  Transformation.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Transformation.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('transformation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('transformation:remove', doc);
}