'use strict';

angular.module('examAppopenshiftApp')
    .controller('NavbarCtrl', function ($scope, $location) {
        $scope.menu = [
            {
                'title': 'Home',
                'link': '/'
            },
            {
                'title': 'The Game',
                'link': '/game'
            }
    ];

        $scope.isCollapsed = true;

        $scope.isActive = function (route) {
            return route === $location.path();
        };
    });