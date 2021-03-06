'use strict';

angular.module('examAppopenshiftApp')
    .controller('MainCtrl', function ($scope, $http, socket) {
        $scope.highscore = {};
        $scope.awesomeThings = [];
       

        $http.get('/api/highscores').success(function (highscores) {
                console.log('highscores', highscores);
                $scope.highscore = highscores;
                //socket.syncUpdates('highscore', $scope.awesomeThings);
        });

        $scope.addThing = function () {
            if ($scope.newThing === '') {
                return;
            }
            $http.post('/api/highscores', {
                name: $scope.newThing
            });
            $scope.newThing = '';
        };

        $scope.deleteThing = function (thing) {
            $http.delete('/api/highscores/' + thing._id);
        };

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('highscore');
        });


    });