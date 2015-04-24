
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

	            var rows = (height / 50) + 1;
	            var cols = (width / 50) + 1;
	            var mX = 0,
	                mY = 0;

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
	            var tileSize = 51;
	            var iFrequency = 1000; // expressed in miliseconds
	            var myInterval = 0;
	            var enemies;


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
	                var towerTile = game.add.button(pX, pY, 'tower_tile', isBgTile, this);
	                bgTile.TilePX = pX;
	                bgTile.TilePY = pY;
	                bgTile.TileMX = mX;
	                bgTile.TileMY = mY;
	                tileMatrix[mX][mY] = bgTileNumber;

	            }

	            function clickIceTower() {
	                console.log("Clicked on ice tower");
	            }

	            function buyTower(towerTile) {
	                var towerIce = this.game.add.button(towerTile.TilePX, towerTile.TilePY, 'tower_ice', clickIceTower, this);
	                //Lav et istårn, der gør noget x sekund
	                spawnEnemy();
	            }

	            function spawnEnemy() {
//	               var enemy = game.add.sprite(400,400,"enemy");
//                    var enemy2 = icetower.Enemy(game, 200, 200,5,5);
	            }

	            //            function isBgTile(bgtile) {
	            //                console.log('hej');
	            //                console.log("X: " + bgtile.TileMX);
	            //                console.log("Y: " + bgtile.TileMY);
	            //                console.log("dennne bgtile er : " + tileMatrix[bgtile.TileMX][bgtile.TileMY]);
	            //            }
	            //
	            //            function isPathTile(pathTile) {
	            //                console.log('hej');
	            //                console.log("X: " + pathTile.TileMX);
	            //                console.log("Y: " + pathTile.TileMY);
	            //                console.log("dennne pathtile er : " + tileMatrix[pathTile.TileMX][pathTile.TileMY]);
	            //            }
	            //
	            //            function isTowerTile(towerTile) {
	            //                console.log('hej');
	            //                console.log("X: " + towerTile.TileMX);
	            //                console.log("Y: " + towerTile.TileMY);
	            //                console.log("dennne towerTile er : " + tileMatrix[towerTile.TileMX][towerTile.TileMY]);
	            //            }

	            function placeBgTile(pX, pY, mX, mY, game) {
	                var bgTile = game.add.button(pX, pY, 'background_tile', null, this);
	                bgTile.TilePX = pX;
	                bgTile.TilePY = pY;
	                bgTile.TileMX = mX;
	                bgTile.TileMY = mY;
	                tileMatrix[mX][mY] = bgTileNumber;
	            }

	            function placePathTile(pX, pY, mX, mY, game) {
	                //                                if (mX >= cols) {
	                //                                    console.log("HOV! mX er: " + mX);
	                //                                    mX = mX - 1;
	                //                                }
	                var pathTile = game.add.button(pX, pY, 'path_tile', null, this);
	                pathTile.TilePX = pX;
	                pathTile.TilePY = pY;
	                pathTile.TileMX = mX;
	                pathTile.TileMY = mY;
	                tileMatrix[mX][mY] = pathTileNumber;
	            }

	            function placeTowerTile(pX, pY, mX, mY, game) {
	                var towerTile = game.add.button(pX, pY, 'tower_tile', buyTower, this);
	                towerTile.TilePX = pX;
	                towerTile.TilePY = pY;
	                towerTile.TileMX = mX;
	                towerTile.TileMY = mY;

	                tileMatrix[mX][mY] = towerTileNumber;
	            }

	            function insertBackground(game) {
	                for (var pY = 0; pY < height; pY += tileSize) {
	                    mX = 0;
	                    for (var pX = 0; pX < width; pX += tileSize) {
	                        placeBgTile(pX, pY, mX, mY, game);
	                        mX++;
	                    }
	                    mY++;
	                }
	            }

	            function insertPath(game) {
	                var pY = 459;
	                var randomNumber;
	                mX = 0;
	                mY = Math.floor(rows / 2) + 1;
	                var north = 1;
	                var east = 2;
	                var south = 3;
	                var direction;
	                for (var pX = 0; pX < width; pX += tileSize) {
	                    randomNumber = Math.floor(Math.random() * 3) + 1;
	                    if (randomNumber === north && direction != south && pY > 0) {
	                        pY = pY - tileSize;
	                        mY = mY - 1;
	                        placePathTile(pX, pY, mX, mY, game);

	                        direction = north;
	                        pX = pX - tileSize;
	                    } else if (randomNumber === south && direction != north && pY < height) {
	                        pY = pY + tileSize;
	                        mY = mY + 1;
	                        placePathTile(pX, pY, mX, mY, game);

	                        direction = south;
	                        pX = pX - tileSize;
	                    } else {

	                        for (var i = 0; i < 2; i++) {
	                            placePathTile(pX, pY, mX, mY, game);
	                            pX = pX + tileSize;
	                            mX++;
	                        }
	                        placePathTile(pX, pY, mX, mY, game);
	                        pX = pX - tileSize;

	                        direction = east;
	                    }
	                }
	            }

	            function insertTowers(game) {
	                for (var pY = 0; pY < height; pY += tileSize) {
	                    for (var pX = 0; pX < width; pX += tileSize) {
	                        var x = getMatrixPosByPixel(pX);
	                        var y = getMatrixPosByPixel(pY);
	                        if (tileMatrix[x][y] === pathTileNumber) {
	                            if (y != 0 && tileMatrix[x][y - 1] !== pathTileNumber) { //Ovenover
	                                placeTowerTile(pX, pY - tileSize, x, y - 1, game);
	                            }
	                            if (y != rows && tileMatrix[x][y + 1] !== pathTileNumber) {
	                                placeTowerTile(pX, pY + tileSize, x, y + 1, game); //nedenunder
	                            }
	                            if (x != 0 && tileMatrix[x - 1][y] !== pathTileNumber) { // venstre
	                                placeTowerTile(pX - tileSize, pY, x - 1, y, game);
	                            }
	                            if (x != cols && tileMatrix[x + 1][y] !== pathTileNumber) { // højre
	                                placeTowerTile(pX + tileSize, pY, x + 1, y, game);
	                            }
	                        }
	                    }
	                }
	            }

	            function getMatrixPosByPixel(pixel) {
	                return pixel / tileSize;
	            }



	            insertBackground(this.game);
	            insertPath(this.game);
	            insertTowers(this.game);


	            //             for (var pX = 0; pX < width; pX += tileSize) {
	            //                mX = 0;
	            //                for (var pY = 0; pY < height; pY += tileSize) {
	            //                    placeBgTile(pX, pY, mX, mY, this.game);
	            //                    mX++;
	            //                }
	            //                mY++;
	            //            }
	            //        var randomNumber;
	            //     for (var pX = 0; pX < width; pX += 51) {
	            //        mX = 0;
	            //        for (var pY = 0; pY < height; pY += 51) {
	            //             randomNumber = Math.floor(Math.random() * 3) + 1;
	            //            if (
	            //            placeBgTile(pX,pY,mX,mY,this.game);
	            //          mX++;
	            //        }
	            //        mY++;
	            //      }


	            // ycor height / 2; 
	            //      var ycor = 459;
	            //      var north = 1;
	            //      var east = 2;
	            //      var south = 3;
	            //      var direction;
	            //      var randomnumber = Math.floor(Math.random() * 3) + 1;
	            //      var xx = 0;
	            //      var yy = rows / 2;

	            //      for (var x = 0; x < width; x += 51) {
	            //        //               
	            //        // hvis north
	            //        console.log(randomnumber);
	            //        if (randomnumber === north && direction != south && ycor > 0) {
	            //          ycor = ycor - 51;
	            //          yy--;
	            //
	            //          placeTowerTile(x - 51, ycor, xx - 1, yy, this.game);
	            //          placeTowerTile(x + 51, ycor, xx + 1, yy + 1, this.game);
	            //
	            //          var pathTile = this.game.add.button(x, ycor, 'path_tile', isPathTile, this);
	            //          pathTile.TowerXX = xx;
	            //          pathTile.TowerYY = yy;
	            //          tileMatrix[xx][yy] = pathTileNumber;
	            //
	            //
	            //          x = x - 51;
	            //          direction = north;
	            //
	            //        }
	            //        // hvis south
	            //        else if (randomnumber === south && direction != north && ycor < height) {
	            //          ycor = ycor + 51;
	            //          yy++;
	            //          placeTowerTile(x - 51, ycor, xx - 1, yy, this.game);
	            //          placeTowerTile(x + 51, ycor, xx + 1, yy + 1, this.game);
	            //
	            //          var pathTile = this.game.add.button(x, ycor, 'path_tile', isPathTile, this);
	            //          pathTile.TowerXX = xx;
	            //          pathTile.TowerYY = yy;
	            //          tileMatrix[xx][yy] = pathTileNumber;
	            //
	            //          x = x - 51;
	            //          direction = south;
	            //
	            //
	            //        }
	            //
	            //        // hvis east
	            //        else {
	            //          if (tileMatrix[xx][yy + 1] !== pathTileNumber) {
	            //            placeTowerTile(x, ycor + 51, xx, yy + 1, this.game);
	            //          }
	            //          if (tileMatrix[xx][yy - 1] !== pathTileNumber) {
	            //            placeTowerTile(x, ycor - 51, xx, yy - 1, this.game);
	            //          }
	            //
	            //          var pathTile = this.game.add.button(x, ycor, 'path_tile', isPathTile, this);
	            //          pathTile.TowerXX = xx;
	            //          pathTile.TowerYY = yy;
	            //          tileMatrix[xx][yy] = pathTileNumber;
	            //
	            //          xx++;
	            //          x = x + 51;
	            //
	            //          placeTowerTile(x, ycor - 51, xx, yy - 1, this.game);
	            //          placeTowerTile(x, ycor + 51, xx, yy + 1, this.game);
	            //
	            //          var pathTile = this.game.add.button(x, ycor, 'path_tile', isPathTile, this);
	            //          pathTile.TowerXX = xx;
	            //          pathTile.TowerYY = yy;
	            //          tileMatrix[xx][yy] = pathTileNumber;
	            //
	            //          xx++;
	            //
	            //          placeTowerTile(x + 51, ycor - 51, xx, yy - 1, this.game);
	            //          placeTowerTile(x + 51, ycor + 51, xx, yy + 1, this.game);
	            //          placeTowerTile(x + 102, ycor, xx + 1, yy, this.game);
	            //
	            //          var pathTile = this.game.add.button(x + 51, ycor, 'path_tile', isPathTile, this);
	            //          pathTile.TowerXX = xx;
	            //          pathTile.TowerYY = yy;
	            //
	            //          if (xx >= cols) {
	            //            xx = cols - 1;
	            //          }
	            //          tileMatrix[xx][yy] = pathTileNumber;
	            //
	            //          direction = east;
	            //        }
	            //
	            //        randomnumber = Math.floor(Math.random() * 3) + 1;
	            //
	            //      }



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