'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HighscoreSchema = new Schema({
//    _id: String,
    name: String,
    score: Number
//    date: {
//        type: Date,
//        default: Date.now
//    }
});

module.exports = mongoose.model('Highscore', HighscoreSchema);