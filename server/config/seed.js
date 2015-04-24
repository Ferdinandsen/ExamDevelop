/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Highscore = require('../api/highscore/highscore.model');


Highscore.find({}).remove(function() {
  Highscore.create({
    name : 'Anaconda',
    score : '100',
    date: "2015-03-24T11:23:22.048Z"
  }, {
    name : 'Rambo',
    score : '1000',
      date: "2015-03-24T11:23:22.048Z"
  }, {
    name : 'Chuck Norris',
    score : '99999999999'
      ,date: "2015-04-24T11:23:22.048Z"
  },  {
    name : 'Conan',
    score : '20',
      date: "2015-02-24T11:23:22.048Z"
  },  {
    name : 'André',
    score : '-300'
  },{
    name : 'Lars Bilde',
    score : '800000000'
  });
});