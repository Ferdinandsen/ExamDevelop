'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HighscoreSchema = new Schema({
  name: String,
  score: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Highscore', HighscoreSchema);