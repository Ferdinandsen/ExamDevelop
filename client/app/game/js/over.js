(function () {
    'use strict';

    function Over() {}


    Over.prototype = {
        init: function (endScore) {
            this.game.name = null;
            while (this.game.name === null) {
                this.game.name = prompt("Game over... What is your name?");
            }
            this.game.score = endScore;
            var allHighscores = [];
            //            $http.get('/api/highscores').success(function (highscores) {
            //                $scope.allHighscores = highscores.all;
            //            });
            var parameters = {
                "name": this.game.name,
                "score": this.game.score
            };
            var highscoreObj = JSON.stringify(parameters);



            var index = 0;
            //send JSON to API
            var xmlhttp = new XMLHttpRequest();
            var url = "http://localhost:9000/api/highscores";
            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Content-type", "application/JSON");
            xmlhttp.send(highscoreObj);


            $.get('http://localhost:9000/api/highscores', function (responseText) {
                var resultList = [];
                allHighscores = responseText.all;
                allHighscores.sort(compare);
                for (var i = 0; i < allHighscores.length; i++) {
                    if (allHighscores[i].score <= endScore) {
                        index = i;
                        for (var a = index - 5; a != index; a++) {
                            if (a < 0) {
                                a = 0;
                            }

                            resultList.push(allHighscores[a]);

                        }
                        resultList.push(allHighscores[index]);
                        for (var b = index + 1; b != index + 6; b++) {
                            if (b > allHighscores.length) {
                                b = allHighscores.length - 1;
                            }

                            resultList.push(allHighscores[b]);
                        }
//                        console.log(resultList.length);
                        test(resultList);
                        break;
                    }
                }

                function test(resultList) {
                    for (var i = 0; i < resultList.length; i++) {
                        console.log(resultList[i].name + " " + resultList[i].score);
                    }
                };

            });



            function compare(a, b) {
                if (a.score < b.score)
                    return 1;
                if (a.score > b.score)
                    return -1;
                return 0;
            }









        },
        create: function () {
            var score = this.game.score;
            this.game.stage.backgroundColor = '#000000';
            this.game.add.audio('gameover').play();
            var infoLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Du fik: ' + score + '\nClick eller tab for at genstarte', {
                font: '20px Lucida Console',
                fill: '#fff',
                align: 'center'
            });
            infoLabel.anchor.setTo(0.5, 8);

            for (var i = 0; i < this.game.allHighscores; i++) {
                console.log("test");
            }


            //            var label = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '\n' + this.game.name + ' døde!\nDu fik: ' + score + '\nClick eller tab for at genstarte', {
            //                font: '20px Lucida Console',
            //                fill: '#fff',
            //                align: 'center'
            //            });




            this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        },

        update: function () {
            if (this.game.input.activePointer.isDown) {
                this.game.state.start('game');

            }
        }
    };


    window['pixione'] = window['pixione'] || {};
    window['pixione'].Over = Over;

}());