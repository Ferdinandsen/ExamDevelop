/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Highscore = require('./highscore.model');

exports.register = function(socket) {
  Highscore.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Highscore.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('highscore:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('highscore:remove', doc);
}