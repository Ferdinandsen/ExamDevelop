(function () {
    'use strict';

    function GameState() { }

    GameState.prototype = {
        init: function () {
            this.ns = window['pixione'];
            this.ns.Bird();
            this.gametime = 0;
            this.creeps = [];
            this.creepcount = 0;
            this.creepStartYPos = null;
            this.pi = 0;
            this.playerhealth = 1000;
            this.level = 0;
            this.waveTimer = 4; // start tiden for creeps
            this.creepSpawnTimer = 50;
            this.test = 0;
            this.spawnAmount = 0;
            this.towerCost = 30;
            this.canAffordTower = true;
        },

        create: function () {
            var game = this.game;
            game.physics.setBoundsToWorld();
            game.gameState = this;
            var createScope = this;

            //Baggrunds farve
            game.stage.backgroundColor = '#ffffff';
            game.stage.disableVisibilityChange = true;

            //Tower variabler
            this.towerCount = 0;
            this.towers = [];
            var towers = this.towers;
            var towerCount = this.towerCount;

            //Tower typenames
            this.iceTower = 'tower_ice';
            this.fireTower = 'tower_fire';
            this.lightningTower = 'tower_lightning';

            //Creep typenames
            this.bunnyCreep = 'rabbit';
            this.bossCreep = 'boss';

            this.bgTileNumber = 1;
            this.pathTileNumber = 2;
            this.towerTileNumber = 3;
            this.iceTowerTileNumber = 4;

            var bgTileNumber = this.bgTileNumber,
                pathTileNumber = this.pathTileNumber,
                towerTileNumber = this.towerTileNumber,
                iceTower = this.iceTowerTileNumber; // <------------------------------------------------ ?????

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


            this.tileMatrix = [];
            var tileMatrix = this.tileMatrix;
            while (tileMatrix.push(new Array(rows)) < cols);

            var scoreText;
            var goldText;
            var healthText;
            var levelText;
            var waveText;
            var menuBarText;
            //Set Starting gold amount
            this.gold = 100;

            var isGameOver = false;
            var music;
            var mew;

            // 50 er tiles størrelse
            this.tileSize = 50;
            var tileSize = this.tileSize;

            this.points = {
                'x': [],
                'y': []
            };
            var points = this.points;

            this.highscore = 0;

            this.updateGold = function (gold) {
                this.gold -= gold;
                goldText.setText('Gold: ' + this.gold);
                if (this.gold >= this.towerCost) {
                    this.canAffordTower = true;
                } else {
                    this.canAffordTower = false;
                }
                for (var i = 0; i < this.towers.length; i++) {
                    var localTower = this.towers[i];
                    localTower.checkForUpgrade(localTower); //<-----------------------------------------------the fuck ? sender sig selv ind i sig selv ? callback?
                }
            };

            this.updateCurrency = function (score, gold) {
                this.gold += gold;
                this.highscore += score;
                scoreText.setText('Score: ' + this.highscore);
                goldText.setText('Gold: ' + this.gold);
                if (this.gold >= this.towerCost) {
                    this.canAffordTower = true;
                } else {
                    this.canAffordTower = false;
                }
                for (var i = 0; i < this.towers.length; i++) {
                    var localTower = this.towers[i];
                    localTower.checkForUpgrade(localTower);
                }
            };

            this.updateHealth = function () {
                healthText.setText('Health: ' + this.playerhealth);
            };

            this.updateLevelText = function () {
                levelText.setText('Level: ' + this.level);
            };

            this.getFrames = function (seconds) {
                return seconds * 60;
            };

            this.updateWaveText = function () {
                waveText.setText('Next wave in: ' + this.waveTimer);
            };

            this.nextLevel = function () {
                this.spawnAmount = 0;
                this.level++;
                this.updateLevelText();
            };

            function placeTowerTile(x, y, xx, yy, game) {
                var towerTile = game.add.button(pX, pY, 'tower_tile', isBgTile, this);
                bgTile.TilePX = pX;
                bgTile.TilePY = pY;
                bgTile.TileMX = mX;
                bgTile.TileMY = mY;
                tileMatrix[mX][mY] = bgTileNumber;
            };

            function placeBgTile(pX, pY, mX, mY, game) {
                var bgTile = game.add.button(pX, pY, 'background_tile', null, this);
                bgTile.TilePX = pX;
                bgTile.TilePY = pY;
                bgTile.TileMX = mX;
                bgTile.TileMY = mY;
                tileMatrix[mX][mY] = bgTileNumber;
            };

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
            };

            function placeTowerTile(pX, pY, mX, mY, game) {
                var towerTile = game.add.button(pX, pY, 'tower_tile', this);
                towerTile.TilePX = pX;
                towerTile.TilePY = pY;
                towerTile.TileMX = mX;
                towerTile.TileMY = mY;
                tileMatrix[mX][mY] = towerTileNumber;
            };

            function placeTowerByMouse(pX, pY, mX, mY, towerType) {
                if (createScope.gold >= createScope.towerCost && tileMatrix[mX][mY] !== createScope.iceTowerTileNumber && tileMatrix[mX][mY] == towerTileNumber) {
                    tileMatrix[mX][mY] = createScope.iceTowerTileNumber;
                    var aTower = new createScope.game.gameState.ns.Tower(createScope.towerCount, createScope.game.gameState, pX, pY, createScope.towerBullets, towerType);
                    createScope.towers.push(aTower);
                    createScope.towerCount++;
                    createScope.updateGold(createScope.towerCost);
                } else {
                    alert("You cannot place a tower there")
                    // todo todo todo}
                }
            };

            function insertBackground(game) {
                for (var pY = 0; pY < height; pY += tileSize) {
                    mX = 0;
                    for (var pX = 0; pX < width; pX += tileSize) {
                        placeBgTile(pX, pY, mX, mY, game);
                        mX++;
                    }
                    mY++;
                }
            };

            function insertPath(game) {
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
                    if (randomNumber === north && direction != south && pY > 200) {
                        pY = pY - tileSize;
                        mY = mY - 1;
                        placePathTile(pX, pY, mX, mY, game);
                        direction = north;
                        pX = pX - tileSize;

                    } else if (randomNumber === south && direction != north && pY < height - 100) {
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
            };

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
            };

            function insertIceTowersToBuy(game) {
                var x = 600;
                var y = 70;
                var towerType = game.gameState.iceTower;
                var iceTowerMenu = game.add.button(x, y, towerType, null, this);
                var sprite = createScope.game.add.sprite(x, y, towerType);
                initializeSpriteproperties(sprite, x, y, towerType);
            };

            function insertFireTowersToBuy(game) {
                var x = 700;
                var y = 70;
                var towerType = game.gameState.fireTower;
                var fireTowerMenu = game.add.button(x, y, towerType, null, this);
                var sprite = createScope.game.add.sprite(x, y, towerType);
                initializeSpriteproperties(sprite, x, y, towerType);
            };

            function insertLightningTowersToBuy(game) {
                var x = 800;
                var y = 70;
                var towerType = game.gameState.lightningTower;
                var lightningTowerMenu = game.add.button(x, y, towerType, null, this);
                var sprite = createScope.game.add.sprite(x, y, towerType);
                initializeSpriteproperties(sprite, x, y, towerType);
            };

            function initializeSpriteproperties(sprite, x, y, towerType) {
                sprite.inputEnabled = true;
                sprite.input.enableDrag();
                sprite.type = towerType;
                sprite.posX = x;
                sprite.posY = y;
                sprite.events.onDragStart.add(startDrag, this);
                sprite.events.onDragStop.add(stopDrag, this);
            };

            function startDrag(theSprite) {
                if (!createScope.canAffordTower) {
                    theSprite.inputEnabled = false;
                    alert("You cannot afford this tower");
                    //STOP DRAGGING!
                } else {
                    theSprite.inputEnabled = true;
                }
                theSprite.inputEnabled = true;
            };

            function stopDrag(theSprite) {
                var xPos = createScope.game.input.x;
                var yPos = createScope.game.input.y;
                var pX = Math.floor(xPos / tileSize) * tileSize;
                var pY = Math.floor(yPos / tileSize) * tileSize;
                var mX = pX / tileSize;
                var mY = pY / tileSize;
                placeTowerByMouse(pX, pY, mX, mY, theSprite.type);
                theSprite.x = theSprite.posX;
                theSprite.y = theSprite.posY;
            };

            function initializeHighscore() {
                scoreText = createScope.game.add.text(400, 20, 'Score: ' + createScope.highscore, {
                    font: 'bold 24px Arial',
                    fill: '#ffffff'
                });
            };

            function initializeGold() {
                goldText = createScope.game.add.text(200, 20, 'Gold: ' + createScope.gold, {
                    font: 'bold 24px Arial',
                    fill: '#ffffff'
                });
            };

            function initializeHealth() {
                healthText = createScope.game.add.text(600, 20, 'Health: ' + createScope.playerhealth, {
                    font: 'bold 24px Arial',
                    fill: '#ffffff'
                });
            };

            function initializeLevel() {
                levelText = createScope.game.add.text(800, 20, 'Level: ' + createScope.level, {
                    font: 'bold 24px Arial',
                    fill: '#ffffff'
                });
            };

            function initializeTimer() {
                waveText = createScope.game.add.text(1000, 20, 'Next wave in : ' + createScope.waveTimer, {
                    font: 'bold 24px Arial',
                    fill: '#ffffff'
                });
            };

            function initializeMenuBar() {
                menuBarText = createScope.game.add.text(0, 110, '________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________', {
                    font: 'bold 24px Arial',
                    fill: '#ffffff'
                });
                menuBarText = createScope.game.add.text(0, 40, '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', {
                    font: 'bold 24px Arial',
                    fill: '#ffffff'
                });
            };

            function getMatrixPosByPixel(pixel) {
                return pixel / tileSize;
            };

            function towerBullets() {
                createScope.towerBullets = game.add.group();
                createScope.towerBullets.enableBody = true;
                createScope.towerBullets.physicsBodyType = Phaser.Physics.ARCADE;
            };

            insertBackground(game);
            insertPath(this.game);
            insertTowers(this.game);
            insertIceTowersToBuy(this.game);
            insertFireTowersToBuy(this.game);
            insertLightningTowersToBuy(this.game);
            initializeGold();
            initializeHighscore();
            initializeHealth();
            initializeLevel();
            initializeTimer();
            initializeMenuBar();
            towerBullets();

            //music
            music = this.game.add.audio('bgmusic');
            music.play('', 0, 1, true);
            this.gameOver = function () {
                isGameOver = true;
                music.stop();
                game.state.start('over', true, false, this.highscore);
            };
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

        spawnCreeps: function () {
            this.test2 = 0;
            var delay = 500;
            var counter = 0;
            var localGameState = this;

            var testCreeps = this.creeps;
            var finish = false;
            var maxCreeps = this.level * 5;
            var creepType = this.bunnyCreep;

            while (!finish) { // spwan untill the amount is reached
                this.test2++;
                if (this.spawnAmount !== maxCreeps) {
                    this.spawnAmount++;
                    counter++;
                    if (this.spawnAmount === maxCreeps) {
                        this.time.events.add(counter * delay, function () {
                            var newBunny = new bunny(localGameState.creepcount, localGameState.game, localGameState.points, localGameState.creepStartYPos, localGameState.pi, localGameState.bossCreep);
                            testCreeps.push(newBunny);
                            localGameState.creepcount++;
                        });
                    } else {
                        this.time.events.add(counter * delay, function () {
                            var newBunny = new bunny(localGameState.creepcount, localGameState.game, localGameState.points, localGameState.creepStartYPos, localGameState.pi, creepType);
                            testCreeps.push(newBunny);
                            localGameState.creepcount++;
                        });
                    }
                } else {
                    finish = true;
                }
            }
        },

        update: function () {
            if (this.test % 60 == 0) {
                if (this.waveTimer === 0) { //spawn next creepwave
                    this.waveTimer = 21;
                    this.nextLevel();
                    this.spawnCreeps();
                    return;
                } else {
                    this.waveTimer--;
                }
                this.updateWaveText();
            }

            if (this.creepStartYPos === null) {
                this.getCreepStartYPos();
            }

            for (var i = 0; i < this.creeps.length; i++) {
                if (this.creeps[i].alive) {
                    this.creeps[i].update();
                }
            }
            for (var i = 0; i < this.towers.length; i++) {
                this.towers[i].update(this.creeps, this.towers[i]);
            }
            this.test++;
        }
    };

    window['pixione'] = window['pixione'] || {};
    window['pixione'].GameState = GameState;

} ());


bunny = function (index, game, points, startY, pi, creepType) {

    this.index = index;
    this.path = [];
    this.startY = startY;
    this.startX = 0;
    this.points = points;
    this.creepType = creepType;
    this.pi = pi;
    this.game = game;
    this.alive = true;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);



    switch (creepType) {
        case this.game.gameState.bunnyCreep:
            this.maxHealth = this.game.gameState.level * 5;
            this.health = this.game.gameState.level * 5;
            this.score = 5;
            this.gold = 20;
            //Sets the speed of the bunny
            var x = 0.001000;
            this.movementSpeed = x;
            this.creepSprite = this.game.add.sprite(this.startX, this.startY, 'rabbit');
            this.game.physics.enable(this.creepSprite, Phaser.Physics.ARCADE);
            this.creepSprite.animations.add('move', Phaser.Animation.generateFrameNames('kriecht e', 0, 3, '', 4), 30, true); //
            this.creepSprite.animations.play('move', 10, true);
            this.creepSprite.scale.setTo(0.7, 0.7);
            break;

        case this.game.gameState.bossCreep:
            this.maxHealth = this.game.gameState.level * 10;
            this.health = this.game.gameState.level * 10;
            this.score = 50;
            this.gold = 100;
            //Sets the speed of the bunny
            var x = 0.002000;
            this.movementSpeed = x;
            this.creepSprite = this.game.add.sprite(this.startX, this.startY, 'bossRabbit');
            this.game.physics.enable(this.creepSprite, Phaser.Physics.ARCADE);
            this.creepSprite.animations.add('move', Phaser.Animation.generateFrameNames('kriecht e', 0, 3, '', 4), 30, true); //
            this.creepSprite.animations.play('move', 10, true);
            this.creepSprite.scale.setTo(0.7, 0.7);
            break;
    }

    this.creepSprite.healthbar = this.game.add.sprite(0, startY, 'healthbar');
    this.creepSprite.healthbar.cropEnabled = true;

    this.creepSprite.anchor.set(0);
    this.creepSprite.index = index;
    //<<<<<<< HEAD

    // make path
    this.generateMovementPath();
};

bunny.prototype.generateMovementPath = function () {
    //=======
    this.creepSprite.animations.add('move', Phaser.Animation.generateFrameNames('kriecht e', 0, 3, '', 4), 30, true); //
    this.creepSprite.animations.play('move', 10, true);


    //>>>>>>> feature/fix_lag
    for (var i = 0; i <= 1; i += this.movementSpeed) {
        var px = this.game.math.linearInterpolation(this.points.x, i);
        var py = this.game.math.linearInterpolation(this.points.y, i);
        this.path.push({
            x: px,
            y: py
        });
    }
};

bunny.prototype.damage = function (damage) {
    this.health -= damage;

    this.creepSprite.healthbar.width = (this.health / this.maxHealth) * this.creepSprite.healthbar.width;

    if (this.health <= 0) {
        this.game.gameState.updateCurrency(this.score, this.gold);
        this.game.gameState.mew = this.game.add.audio('mew');
        this.game.gameState.mew.play('', 0, 9, false);
        this.creepSprite.healthbar.kill();
        return this.kill();
    }
    return false;
};

bunny.prototype.kill = function () {
    this.alive = false;
    this.creepSprite.kill();

    return true;
};

bunny.prototype.update = function () {
    this.gametime++;
    this.creepSprite.healthbar.x = this.creepSprite.x;
    this.creepSprite.healthbar.y = this.creepSprite.y - 10;
    this.creepSprite.x = this.path[this.pi].x;
    this.creepSprite.y = this.path[this.pi].y;
    this.pi++;
    if (this.pi >= this.path.length) {
        this.creepSprite.healthbar.kill();
        this.game.gameState.playerhealth--;
        this.game.gameState.creeps.splice(this.index, 1);

        for (var i = this.index; i < this.game.gameState.creeps.length; i++) {
            this.game.gameState.creeps[i].index--;
            this.game.gameState.creeps[i].creepSprite.index--;
        }
        this.kill();
        this.game.gameState.creepcount--;
        this.game.gameState.updateHealth();
        if (this.game.gameState.playerhealth <= 0) {
            this.game.gameState.gameOver();
        }
        this.pi = 0;
    }
};