(function () {
    'use strict';

    function Over() {}


    Over.prototype = {
        init: function (endScore) {
            var scope = this;
            this.game.name = null;
            this.game.score = endScore;
            this.lort = 5;
            this.game.lort = 5;
            var lort = 5;


            var allHighscores = [];
            var index = 0;
            //send JSON to API
            var xmlhttp = new XMLHttpRequest();
            var url = "http://localhost:9000/api/highscores";

            while (this.game.name === null) {
                this.game.name = prompt("Game over... What is your name?");
            }
            var parameters = {
                "name": this.game.name,
                "score": this.game.score
            };
            var highscoreObj = JSON.stringify(parameters);

            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Content-type", "application/JSON");
            xmlhttp.send(highscoreObj);

            $.get('http://localhost:9000/api/highscores', function (responseText) {
                var resultList = [];

                allHighscores = responseText.all;
                // Sorts allHighscores by the score property descending
                allHighscores.sort(compare);

                for (var i = 0; i < allHighscores.length; i++) {
                    if (allHighscores[i].score <= endScore) {
                        index = i;
                        break;
                    }
                }
                for (var a = index - 5; a < index; a++) {
                    if (a < 0) {
                        break;
                    }
                    resultList.push(allHighscores[a]);
                }
                resultList.push(allHighscores[index]);
                for (var b = index + 1; b < index + 6; b++) {
                    if (b > allHighscores.length) {
                        break;
                    }
                    resultList.push(allHighscores[b]);
                }
                test(resultList);
            });

            function test(resultList) {

                //console.log("Test begynd");
                for (var i = 0; i < resultList.length; i++) {
                    //console.log(resultList[i].name + " " + resultList[i].score);
                    var color = '#fff';
                    if (allHighscores[index]._id === resultList[i]._id) {
                        color = '#00FF00';
                    }
                    var scoreLabel = scope.game.add.text(scope.game.world.centerX, scope.game.world.centerY, i + 1 + '. ' + resultList[i].name + " " + resultList[i].score, {
                        font: '20px Lucida Console',
                        fill: color,
                        align: 'left'
                    });
                    scoreLabel.anchor.setTo(0.5, 8 - i);
                }
            };

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
            this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        },

        update: function () {
            if (this.game.input.activePointer.isDown) {
                this.game.state.start('game');

            }
        }
    };

    window['pixione'] = window['pixione'] || {};
    window['pixione'].Over = Over;;

}());