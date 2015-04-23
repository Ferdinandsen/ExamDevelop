(function () {
  'use strict';

  function Game() {

  }

  Game.prototype = {
    init: function () {
      this.game.wormSprite = {};
    },
    create: function () {

      //Baggrunds farve
      this.game.stage.backgroundColor = '#ffffff';
      this.game.stage.disableVisibilityChange = true;

      var height = this.game.height;
      var width = this.game.width;
      var bgTileNumber = 1,
        pathTileNumber = 2,
        towerTileNumber = 3;

      var rows = height / 50,
        cols = width / 50;
      var xx = 0,
        yy = 0;

      // 50 er tiles størrelser
      var tileMatrix = [];
      while (tileMatrix.push(new Array(rows)) < cols);
      var sumsArray = [];
      var questionText;
      var randomSum;
      var timeTween;
      var numberTimer = {};
      var buttonMask;
      var scoreText;
      var isGameOver = false;
      var topScore;
      var numbersArray = [-3, -2, -1, 1, 2, 3];
      var game = this.game;
      var score = game.score = 0;
      var music;


      function nextNumber() {
        scoreText.text = 'Score: ' + score.toString() + '\nBest Score: ' + topScore.toString();
        if (buttonMask) {
          buttonMask.destroy();
          game.tweens.removeAll();
        }
        //                buttonMask = game.add.graphics(game.world.centerX - 200, 250);
        //                buttonMask.beginFill(0xffffff);
        //                buttonMask.drawRect(0, 0, 400, 200);
        //                buttonMask.endFill();
        numberTimer.mask = buttonMask;
        if (score > 0) {
          timeTween = game.add.tween(buttonMask);
          timeTween.to({
            x: game.world.centerX + 200
          }, 3000, 'Linear', true);
          timeTween.onComplete.addOnce(function () {
            gameOver();
          }, game);
        }
        randomSum = game.rnd.between(0, 2);
        questionText.text = sumsArray[Math.min(Math.round((score - 100) / 400) + 1, 4)][randomSum][game.rnd.between(0, sumsArray[Math.min(Math.round((score - 100) / 400) + 1, 4)][randomSum].length - 1)];
      }

      function checkAnswer(button) {
        if (!isGameOver) {
          if (button.frame === randomSum) {
            if (buttonMask) {
              score += Math.floor((game.world.centerX - buttonMask.x + 200) / 4);
            }
            game.add.audio('buttonGood').play();
            nextNumber(game);
          } else {
            if (score > 0) {
              timeTween.stop();
            }
            game.add.audio('buttonBad').play();
            gameOver();
          }
        }
      }

      function placeTowerTile(x, y, xx, yy, game) {
//        if (xx >= cols) {
//          xx = cols - 1;
//        }
//        if (xx < 0) {
//          xx = 0;
//        }
//        var towerTile = game.add.button(x, y, 'tower_tile', buyTower, this);
//        towerTile.TowerXX = xx;
//        towerTile.TowerYY = yy;
//        towerTile.TowerX = x;
//        towerTile.TowerY = y;
//        tileMatrix[xx][yy] = towerTileNumber;
//        console.log('xx', xx);
      }

      function buyTower(towerTile) {
//        console.log('hej');
//        console.log(towerTile.TowerXX);
//        console.log(towerTile.TowerYY);
//        console.log(tileMatrix[towerTile.TowerXX][towerTile.TowerYY]);
//        var towerIce = this.game.add.button(towerTile.towerX, towerTile.towerY, 'tower_ice', buyTower, this);
      }

      function isBgTile(bgtile) {
        console.log('hej');
        console.log("X: " + bgtile.TowerXX);
        console.log("Y: " + bgtile.TowerYY);
        console.log("dennne bgtile er : " + tileMatrix[bgtile.TowerXX][bgtile.TowerYY]);
      }

      function isPathTile(pathTile) {
        console.log('hej');
        console.log("X: " + pathTile.TowerXX);
        console.log("Y: " + pathTile.TowerYY);
        console.log("dennne pathtile er : " + tileMatrix[pathTile.TowerXX][pathTile.TowerYY]);
      }

      // sætter bgtiles
      for (var y = 0; y < height; y += 51) {
        xx = 0;
        for (var x = 0; x < width; x += 51) {
          var bgTile = this.game.add.button(x, y, 'background_tile', isBgTile, this);
          bgTile.TowerXX = xx;
          bgTile.TowerYY = yy;
          tileMatrix[xx][yy] = bgTileNumber;
          xx++;
        }
        yy++;
      }
      // ycor height / 2; 
      var ycor = 459;
      var north = 1;
      var east = 2;
      var south = 3;
      var direction;
      var randomnumber = Math.floor(Math.random() * 3) + 1;
      var xx = 0;
      var yy = rows / 2;

      for (var x = 0; x < width; x += 51) {
        //               
        // hvis north
        console.log(randomnumber);
        if (randomnumber === north && direction != south && ycor > 0) {
          ycor = ycor - 51;
          yy--;

          placeTowerTile(x - 51, ycor, xx - 1, yy, this.game);
          placeTowerTile(x + 51, ycor, xx + 1, yy + 1, this.game);

          var pathTile = this.game.add.button(x, ycor, 'path_tile', isPathTile, this);
          pathTile.TowerXX = xx;
          pathTile.TowerYY = yy;
          tileMatrix[xx][yy] = pathTileNumber;


          x = x - 51;
          direction = north;

        }
        // hvis south
        else if (randomnumber === south && direction != north && ycor < height) {
          ycor = ycor + 51;
          yy++;
          placeTowerTile(x - 51, ycor, xx - 1, yy, this.game);
          placeTowerTile(x + 51, ycor, xx + 1, yy + 1, this.game);

          var pathTile = this.game.add.button(x, ycor, 'path_tile', isPathTile, this);
          pathTile.TowerXX = xx;
          pathTile.TowerYY = yy;
          tileMatrix[xx][yy] = pathTileNumber;

          x = x - 51;
          direction = south;


        }

        // hvis east
        else {
          if (tileMatrix[xx][yy + 1] !== pathTileNumber) {
            placeTowerTile(x, ycor + 51, xx, yy + 1, this.game);
          }
          if (tileMatrix[xx][yy - 1] !== pathTileNumber) {
            placeTowerTile(x, ycor - 51, xx, yy - 1, this.game);
          }

          var pathTile = this.game.add.button(x, ycor, 'path_tile', isPathTile, this);
          pathTile.TowerXX = xx;
          pathTile.TowerYY = yy;
          tileMatrix[xx][yy] = pathTileNumber;

          xx++;
          x = x + 51;

          placeTowerTile(x, ycor - 51, xx, yy - 1, this.game);
          placeTowerTile(x, ycor + 51, xx, yy + 1, this.game);

          var pathTile = this.game.add.button(x, ycor, 'path_tile', isPathTile, this);
          pathTile.TowerXX = xx;
          pathTile.TowerYY = yy;
          tileMatrix[xx][yy] = pathTileNumber;

          xx++;

          placeTowerTile(x + 51, ycor - 51, xx, yy - 1, this.game);
          placeTowerTile(x + 51, ycor + 51, xx, yy + 1, this.game);
          placeTowerTile(x + 102, ycor, xx + 1, yy, this.game);

          var pathTile = this.game.add.button(x + 51, ycor, 'path_tile', isPathTile, this);
          pathTile.TowerXX = xx;
          pathTile.TowerYY = yy;

          if (xx >= cols) {
            xx = cols - 1;
          }
          tileMatrix[xx][yy] = pathTileNumber;

          direction = east;
        }

        randomnumber = Math.floor(Math.random() * 3) + 1;

      }



      //            for (var y = 0; y < height; y += 51) {
      //                xx = 0;
      //
      //                for (var x = 0; x < width; x += 51) {
      //
      //                    if (y === 459) { //height / 2 + 1 for hver y 
      //                        console.log("PATH TILE");
      //                        var pathTile = this.game.add.image(x, y, 'path_tile', this);
      //                    } else {
      //
      //                        if (Math.floor(Math.random() * 25) + 1 === 1) {
      //                            //                        console.log('y = ' + yy);
      //                            //                        console.log('x = ' + xx);
      //                            tileMatrix[xx][yy] = towerTileNumber;
      //                            var towerTile = this.game.add.button(x, y, 'tower_tile', buyTower, this);
      //                            towerTile.towerX = x;
      //                            towerTile.towerXX = xx;
      //                            towerTile.towerY = y;
      //                            towerTile.towerYY = yy;
      //
      //                        } else {
      //                            //tileMatrix[xx][yy] = bgTileNumber;
      //                            var bgTile = this.game.add.image(x, y, 'background_tile', this);
      //                        }
      //                        //                    console.log("Height/2 er: " + height / 2 + ", og y er: "+ y);
      //
      //                        xx++;
      //                        //   this.game.add.button(0,0 , 'background_tile', checkAnswer, this);     button = clickable og checkAnswer er en metode        
      //                    }
      //                }
      //
      //                yy++;
      //            }


      function buildThrees(initialNummber, currentIndex, limit, currentString) {
        for (var i = 0; i < numbersArray.length; i++) {
          var sum = initialNummber + numbersArray[i];
          var outputString = currentString + (numbersArray[i] < 0 ? '' : '+') + numbersArray[i];
          if (sum > 0 && sum < 4 && currentIndex === limit) {
            sumsArray[limit][sum - 1].push(outputString);
          }
          if (currentIndex < limit) {
            buildThrees(sum, currentIndex + 1, limit, outputString);
          }
        }
      }

      function wormSpriteOut(wormSprite) {

        //  Move the alien to the top of the screen again
        wormSprite.reset(-32, game.world.centerY);
        wormSprite.body.velocity.setTo(40, 0);

      }

      music = this.game.add.audio('bgmusic');
      music.play('', 0, 1, true);
      topScore = localStorage.getItem('topScore') === null ? 0 : localStorage.getItem('topScore');
      for (var i = 1; i < 5; i++) {
        sumsArray[i] = [[], [], []];
        for (var j = 1; j <= 3; j++) {
          buildThrees(j, 1, i, j);
        }
      }


      //            game.wormSprite = game.add.sprite(0, game.world.centerY, 'worm');
      //            game.wormSprite.anchor.set(0.5);
      //            game.physics.arcade.enable(game.wormSprite);
      //            game.wormSprite.animations.add('run', Phaser.Animation.generateFrameNames('kriecht e', 0, 6, '', 4), 30, true);
      //            game.wormSprite.animations.play('run', 10, true);
      //            game.wormSprite.body.velocity.setTo(40, 0);
      //            game.wormSprite.checkWorldBounds = true;
      //            game.wormSprite.events.onOutOfBounds.add(wormSpriteOut, this);

      questionText = this.game.add.text(game.world.centerX, 160, '-', {
        font: 'bold 72px Arial',
        fill: '#ffffff'
      });
      questionText.anchor.set(0.5);
      scoreText = this.game.add.text(game.world.centerX - 100, 10, '-', {
        font: 'bold 24px Arial',
        fill: '#ffffff'
      });

      //            for (var k = 0; k < 3; k++) {
      //                var button = this.game.add.button(this.game.world.centerX - 200, 250 + k * 75, 'buttons', checkAnswer, this);
      //                button.frame = k;
      //                button.input.useHandCursor = true;
      //            }
      // numberTimer = this.game.add.sprite(this.game.world.centerX - 200, 250, 'timebar');
      nextNumber();

      function gameOver() {
        isGameOver = true;
        localStorage.setItem('topScore', Math.max(score, topScore));
        music.stop();
        game.state.start('over', true, false, score);
      }



    },
    update: function () {


    }


  };

  window['pixione'] = window['pixione'] || {};
  window['pixione'].Game = Game;


}());