'use strict';

angular.module('examAppopenshiftApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/game', {
        templateUrl: 'app/game/game.html'
      });
  });