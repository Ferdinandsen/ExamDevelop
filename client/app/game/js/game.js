(function () {
    'use strict';

    function GameState() {
        console.log(this);
    }

    GameState.prototype = {
        init: function () {
            this.game.wormSprite = {};
            this.creepSpawnTimer = 50;
            this.gametime = -100;
            this.creeps = [];
            this.creepcount = 0;
            this.creepStartYPos = null;
            this.pi = 0;
            this.playerhealth = 10;
        },
        create: function () {
            this.game.gameState = this;
            var createScope = this;
            var game = this.game;
            //Baggrunds farve
            this.game.stage.backgroundColor = '#ffffff';
            this.game.stage.disableVisibilityChange = true;

            this.towerCount = 0;
            this.towers = [];
            var towers = this.towers;
            var towerCount = this.towerCount;

            this.bgTileNumber = 1;
            this.pathTileNumber = 2;
            this.towerTileNumber = 3;
            var bgTileNumber = this.bgTileNumber,
                pathTileNumber = this.pathTileNumber,
                towerTileNumber = this.towerTileNumber;

            this.height = this.game.height;
            this.width = this.game.width;
            var height = this.height;
            var width = this.width;

            this.rows = (this.height / 50) + 1;
            this.cols = (this.width / 50) + 1;
            var cols = this.cols;
            var rows = this.rows;

            var mX = 0,
                mY = 0;

            // 50 er tiles størrelser
            this.tileMatrix = [];
            var tileMatrix = this.tileMatrix;
            while (tileMatrix.push(new Array(rows)) < cols);

            var scoreText;
            var goldText;
            var healthText;
            this.gold = 0;

            var isGameOver = false;
            var music;

            this.tileSize = 50;
            var tileSize = this.tileSize;

            this.points = {
                'x': [],
                'y': []
            };
            var points = this.points;

            this.highscore = 0;

            this.updateCurrency = function (score, gold) {
                createScope.gold += gold;
                createScope.highscore += score;
                scoreText.setText('Score: ' + createScope.highscore);
                goldText.setText('Gold: ' + createScope.gold);
            };
            this.updateHealth = function () {
                healthText.setText('Health: ' + this.playerhealth);
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

            function placeBgTile(pX, pY, mX, mY, game) {
                var bgTile = game.add.button(pX, pY, 'background_tile', null, this);
                bgTile.TilePX = pX;
                bgTile.TilePY = pY;
                bgTile.TileMX = mX;
                bgTile.TileMY = mY;
                tileMatrix[mX][mY] = bgTileNumber;
            }

            function placePathTile(pX, pY, mX, mY, game) {
                var pathTile = game.add.button(pX, pY, 'path_tile', null, this);
                pathTile.TilePX = pX;
                pathTile.TilePY = pY;
                pathTile.TileMX = mX;
                pathTile.TileMY = mY;
                if (tileMatrix[mX][mY] !== pathTileNumber) {
                    tileMatrix[mX][mY] = pathTileNumber;
                    points.x.push(pX);
                    points.y.push(pY);
                }
            }

            function placeTowerTile(pX, pY, mX, mY, game) {
                var towerTile = game.add.button(pX, pY, 'tower_tile', buyTower, this);
                towerTile.TilePX = pX;
                towerTile.TilePY = pY;
                towerTile.TileMX = mX;
                towerTile.TileMY = mY;
                tileMatrix[mX][mY] = towerTileNumber;
            }

            function buyTower(towerTile) {
                var newTower = new tower(createScope.towerCount, createScope.game, towerTile.TilePX, towerTile.TilePY, createScope.towerBullets);
                createScope.towers.push(newTower);
                console.log(towers);
                createScope.towerCount++;
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
                //RANDOM NUMBERS
                var pY = height / 2; //459 med tiles 
                var randomNumber;
                mX = 0;
                mY = Math.floor(rows / 2);
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

            function initializeHighscore() {
                scoreText = createScope.game.add.text(400, 20, 'Score: ' + createScope.highscore, {
                    font: 'bold 24px Arial',
                    fill: '#ffffff'
                });
            }

            function initializeGold() {
                goldText = createScope.game.add.text(200, 20, 'Gold: ' + createScope.gold, {
                    font: 'bold 24px Arial',
                    fill: '#ffffff'
                });
            }

            function initializeHealth() {
                healthText = createScope.game.add.text(600, 20, 'Health: ' + createScope.playerhealth, {
                    font: 'bold 24px Arial',
                    fill: '#ffffff'
                });
            }

            function getMatrixPosByPixel(pixel) {
                return pixel / tileSize;
            }

            function towerBullets() {
                createScope.towerBullets = game.add.group();
                createScope.towerBullets.enableBody = true;
                createScope.towerBullets.physicsBodyType = Phaser.Physics.ARCADE;
            }

            insertBackground(game);
            insertPath(this.game);
            insertTowers(this.game);
            initializeGold();
            initializeHighscore();
            initializeHealth();
            towerBullets();

            //			function wormSpriteOut(wormSprite) {
            //				//  Move the alien to the top of the screen again
            //				wormSprite.reset(-32, game.world.centerY);
            //				wormSprite.body.velocity.setTo(40, 0);
            //			}

            music = this.game.add.audio('bgmusic');
            music.play('', 0, 1, true);

            //            game.wormSprite = game.add.sprite(0, game.world.centerY, 'worm');
            //            game.wormSprite.anchor.set(0.5);
            //            game.physics.arcade.enable(game.wormSprite);
            //            game.wormSprite.animations.add('run', Phaser.Animation.generateFrameNames('kriecht e', 0, 6, '', 4), 30, true);
            //            game.wormSprite.animations.play('run', 10, true);
            //            game.wormSprite.body.velocity.setTo(40, 0);
            //            game.wormSprite.checkWorldBounds = true;
            //            game.wormSprite.events.onOutOfBounds.add(wormSpriteOut, this);

            this.gameOver = function () {
                isGameOver = true;
                music.stop();
                game.state.start('over', true, false, this.highscore);
            }
        },

        getPixelPosByMatrixPos: function (koordinat) {
            return koordinat * this.tileSize;
        },

        getCreepStartYPos: function () {
            for (var y = 0; y < this.rows; y++) {
                if (this.tileMatrix[0][y] === this.pathTileNumber) {
                    this.creepStartYPos = this.getPixelPosByMatrixPos(y);
                }
            }
        },

        update: function () {

            if (this.creepStartYPos === null) {
                this.getCreepStartYPos();
            }

            if (this.gametime === this.creepSpawnTimer) {
                //Fix at den forstørrer path array
                this.creeps.push(new bunny(this.creepcount, this.game, this.points, this.creepStartYPos, this.pi))
                this.gametime = 0;
                this.creepcount++;
            }
            for (var i = 0; i < this.creeps.length; i++) {
                if (this.creeps[i].alive) {
                    this.creeps[i].update();
                }
            }
            for (var i = 0; i < this.towers.length; i++) {
                this.towers[i].update(this.creeps, this.game);

            }
            this.gametime++;
        }
    };

    window['pixione'] = window['pixione'] || {};
    window['pixione'].GameState = GameState;

}());

tower = function (index, game, towerX, towerY, towerBullets) {
    towerScope = this;
    this.index = index;
    this.game = game;
    this.towerX = towerX;
    this.towerY = towerY;
    this.damage = 5;
    this.radius = 150;
    this.bullets = towerBullets;
    this.nextFire = 0;
    this.towerSprite = this.game.add.sprite(this.towerX, this.towerY, 'tower_ice');
    this.towerSprite.anchor.set(0);
    //	this.towerSprite.scale(1,1);
    this.game.physics.arcade.enable(this.towerSprite);
    this.firerate = 700;
    this.bulletSpeed = 150;
};

bulletHit = function (bunny, bullet) {
    bullet.kill();
    var destroyed = towerScope.game.gameState.creeps[bunny.index].damage();
    if (destroyed) {}
};
ballhit = function (bunny, bullet) {}

tower.prototype.update = function (creeps, game) {
    this.game.gameState.towerBullets.createMultiple(1, 'bullet');
    for (var i = 0; i < creeps.length; i++) {
        if (game.physics.arcade.distanceBetween(this.towerSprite, creeps[i].creepSprite) < this.radius) {
            if (creeps[i].alive && this.game.time.now > this.nextFire) {
                this.nextFire = this.game.time.now + this.firerate;
                var bullet = this.bullets.getFirstExists(false);
                game.physics.arcade.enable(bullet);
                bullet.reset(this.towerX + this.game.gameState.tileSize / 2, this.towerY + this.game.gameState.tileSize / 2);
                bullet.anchor.set(0.5, 0.5);
                bullet.scale.set(0.2, 0.2);
                bullet.body.setSize(20, 20);
                this.game.debug.body(bullet);
                bullet.rotation = this.game.physics.arcade.moveToObject(bullet, creeps[i].creepSprite, this.bulletSpeed);

                //				this.game.physics.arcade.overlap(this.bullets, creeps[i].creepSprite, bulletHit, null, null);

                this.game.physics.arcade.collide(this.bullets, creeps[i].creepSprite, null, bulletHit);
            }
        }
    }
};

bunny = function (index, game, points, startY, pi) {
    this.index = index;
    this.path = [];
    this.startY = startY;
    this.startX = 0;
    this.points = points;
    this.pi = pi;
    this.game = game;
    this.health = 5;
    this.alive = true;
    this.score = 5;
    this.gold = 20;
    var x = 0.001000;
    this.movementSpeed = x;
    //	var speed = 	1 / game.width/2;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.creepSprite = this.game.add.sprite(this.startX, this.startY, 'worm');
    this.game.physics.enable(this.creepSprite, Phaser.Physics.ARCADE);

    this.creepSprite.anchor.set(0);
    this.creepSprite.scale.setTo(0.7, 0.7);
    this.creepSprite.index = index;
    this.creepSprite.animations.add('move', Phaser.Animation.generateFrameNames('kriecht e', 0, 6, '', 4), 30, true);
    this.creepSprite.animations.play('move', 10, true);

    for (var i = 0; i <= 1; i += this.movementSpeed) {
        var px = this.game.math.linearInterpolation(this.points.x, i);
        var py = this.game.math.linearInterpolation(this.points.y, i);
        this.path.push({
            x: px,
            y: py
        });
    }
};

bunny.prototype.damage = function () {
    //MAGICNUMBERS
    this.health -= 5;
    if (this.health <= 0) {
        this.alive = false;
        this.creepSprite.kill();
        this.game.gameState.updateCurrency(this.score, this.gold);
        return true;
    }
    return false;
};

bunny.prototype.update = function () {
    this.game.debug.body(this.creepSprite);
    this.gametime++;
    this.creepSprite.x = this.path[this.pi].x;
    this.creepSprite.y = this.path[this.pi].y;
    this.pi++;
    if (this.pi >= this.path.length) {
        this.game.gameState.playerhealth--;
        this.game.gameState.updateHealth();
        if (this.game.gameState.playerhealth <= 0) {
            this.game.gameState.gameOver();
        }
        this.pi = 0;
    }
};