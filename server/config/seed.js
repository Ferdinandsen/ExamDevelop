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
    date: "2015-03-24T11:23:22.048Z",
    isDeleted: false
  }, {
    name : 'Rambo',
    score : '900',
    date: "2015-03-24T11:23:22.048Z",
    isDeleted: false
  }, {
    name : 'Conan',
    score : '800',
    date: "2015-02-24T11:23:22.048Z",
    isDeleted: false
  },  {
    name : 'Kaj Børge',
    score : '700',
    isDeleted: false
  },{
    name : 'Lars Bilde',
    score : '600',
    isDeleted: false
  }, {
    name : 'Trillebør',
    score : '500',
    isDeleted: false
  }, {
    name : 'André',
    score : '400',
    isDeleted: false
  }, {
    name : 'Tuller',
    score : '350',
    isDeleted: false
  }, {
    name : 'Slikkepind',
    score : '300',
    isDeleted: false
  }, {
    name : 'Briller',
    score : '270',
    isDeleted: false
  }, {
    name : 'Træt af stole',
    score : '250',
    isDeleted: false
  }, {
    name : 'slik med',
    score : '220',
    isDeleted: false
  }, {
    name : 'Heldigt',
    score : '200',
    isDeleted: false
  }, {
    name : 'Igen',
    score : '150',
    isDeleted: false
  }, {
    name : '*raslen med slikpapir*',
    score : '100',
    isDeleted: false
  }, {
    name : 'Snøffel',
    score : '50',
    isDeleted: false
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