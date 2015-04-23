/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Highscore = require('../api/highscore/highscore.model');


Highscore.find({}).remove(function() {
  Highscore.create({
    name : 'Anaconda',
    score : '100'
  }, {
    name : 'Rambo',
    score : '1000'
  }, {
    name : 'Chuck Norris',
    score : '10000000000000000000000'
  },  {
    name : 'Conan',
    score : '20'
  },  {
    name : 'André',
    score : '-300'
  },{
    name : 'Lars Bilde',
    score : '800000000'
  });
});