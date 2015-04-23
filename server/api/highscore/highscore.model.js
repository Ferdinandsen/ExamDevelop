'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HighscoreSchema = new Schema({
  name: String,
  score: String
});

module.exports = mongoose.model('Highscore', HighscoreSchema);