/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Mock = require('./mock.model');

exports.register = function(socket) {
  Mock.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Mock.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('mock:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('mock:remove', doc);
}