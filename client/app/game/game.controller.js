angular.module('examAppopenshiftApp')
    .controller('GameCtrl', function ($scope) {
       mainGame.startGame(); 
       
       $scope.$on("$destroy", function() {
           mainGame.endGame();
        });           
    });