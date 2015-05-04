/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Highscore = require('../api/highscore/highscore.model');
var User = require('../api/user/user.model');

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
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});