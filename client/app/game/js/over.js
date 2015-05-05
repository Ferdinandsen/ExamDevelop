(function () {
    'use strict';

    function Over() {    }
    

    Over.prototype = {
        init: function (endScore) {
            this.game.name = null;
            this.game.score = endScore;
            
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
//                console.log(this.game.score);
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
                    console.log(allHighscores[a].name);
                }
                resultList.push(allHighscores[index]);
                //console.log("Egen score push");
                for (var b = index + 1; b < index + 6; b++) {
                    //console.log("5 efter push");
                    if (b > allHighscores.length) {
                        break;
                    }
                    resultList.push(allHighscores[b]);
                }
                //console.log("Push slut");
                console.log(Over.game.score);
                test(resultList);
            });


            function test(resultList) {
                this.game = game;
                //console.log("Test begynd");
                for (var i = 0; i < resultList.length; i++) {
                    //console.log(resultList[i].name + " " + resultList[i].score);
                    var infoLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Du fik: ' + score + '\nClick eller tab for at genstarte', {
                        font: '20px Lucida Console',
                        fill: '#fff',
                        align: 'center'
                    });
                    infoLabel.anchor.setTo(0.5, 8);


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
    window['pixione'].Over = Over;

}());