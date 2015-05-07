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
    score : '1000',
    date: "2015-03-24T11:23:22.048Z"
  }, {
    name : 'Rambo',
    score : '900',
      date: "2015-03-24T11:23:22.048Z"
  }, {
    name : 'Conan',
    score : '800',
      date: "2015-02-24T11:23:22.048Z"
  },  {
    name : 'Kaj Børge',
    score : '700'
  },{
    name : 'Lars Bilde',
    score : '600'
  }, {
    name : 'Trillebør',
    score : '500'
  }, {
    name : 'André',
    score : '400'
  }, {
    name : 'Tuller',
    score : '350'
  }, {
    name : 'Slikkepind',
    score : '300'
  }, {
    name : 'Briller',
    score : '270'
  }, {
    name : 'Træt af stole',
    score : '250'
  }, {
    name : 'slik med',
    score : '220'
  }, {
    name : 'Heldigt',
    score : '200'
  }, {
    name : 'Igen',
    score : '150'
  }, {
    name : '*raslen med slikpapir*',
    score : '100'
  }, {
    name : 'Snøffel',
    score : '50'
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