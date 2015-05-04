'use strict';

angular.module('examAppopenshiftApp')
    .controller('AdminCtrl', function ($scope, $http, Auth, User) {

        // Use the User $resource to fetch all users
        $scope.users = User.query();
        $scope.highscores = [];
        $http.get('/api/highscores').success(function (highscores) {
            console.log('highscores', highscores);
            $scope.highscores = highscores.all;
            //socket.syncUpdates('highscore', $scope.awesomeThings);
        });
    
        $scope.deleteHighscore = function (highscore) {
            $http.delete('/api/highscores/' + highscore._id);
            angular.forEach($scope.highscores, function (u, i) {
                 console.log("u" + u);
                console.log("i" + i);
                if (u === highscore) {
                    $scope.highscores.splice(i, 1);
                    console.log("spliced");
                   
                }
            });
        };
    
        $scope.deleteUser = function (user) {
            User.remove({
                id: user._id
            });
            angular.forEach($scope.users, function (u, i) {
                 console.log("u" + u);
                console.log("i" + i);
                if (u === user) {
                    $scope.users.splice(i, 1);
                    console.log("spliced");
                }
            });
        };

    });