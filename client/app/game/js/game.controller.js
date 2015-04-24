var startGame = require('./game-main.js');

angular.module('examAppopenshiftApp')
    .controller('GameCtrl', function ($scope) {
        $scope.start = function () {
            startGame.rungame;
        };

    });