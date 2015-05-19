(function () {
  'use strict';

  function GameState() {
    console.log(this);
  }

  GameState.prototype = {
    init: function () {

      this.game.wormSprite = {};
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
      this.canAffordIceTower = true;
    },

    create: function () {
      this.game.physics.setBoundsToWorld();
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
      this.iceTowerTileNumber = 4;

      this.iceTower = 1;
      this.fireTower = 2;
      this.cannonTower = 3;

      var bgTileNumber = this.bgTileNumber,
        pathTileNumber = this.pathTileNumber,
        towerTileNumber = this.towerTileNumber,
        iceTower = this.iceTowerTileNumber;

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
      var levelText;
      var waveText;
      var menuBarText;

      this.gold = 100;

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

      this.updateGold = function (gold) {
        createScope.gold -= gold;
        goldText.setText('Gold: ' + createScope.gold);
        if (createScope.gold >= createScope.towerCost) {
          createScope.canAffordIceTower = true;
        } else {
          createScope.canAffordIceTower = false;
        }
        for (var i = 0; i < this.towers.length; i++) {
          this.towers[i].checkForUpgrade();
        }
      }

      this.updateCurrency = function (score, gold) {
        createScope.gold += gold;
        createScope.highscore += score;
        scoreText.setText('Score: ' + createScope.highscore);
        goldText.setText('Gold: ' + createScope.gold);
        if (createScope.gold >= createScope.towerCost) {
          createScope.canAffordIceTower = true;
        } else {
          createScope.canAffordIceTower = false;
        }
        for (var i = 0; i < this.towers.length; i++) {
          this.towers[i].checkForUpgrade();
        }
      };

      this.updateHealth = function () {
        healthText.setText('Health: ' + this.playerhealth);
      }
      this.updateLevelText = function () {
        levelText.setText('Level: ' + this.level);
      }
      this.getFrames = function (seconds) {
        return seconds * 60;
      }
      this.updateWaveText = function () {
        waveText.setText('Next wave in: ' + this.waveTimer);
      }
      this.nextLevel = function () {
        console.log("Next LEVEL");
        this.spawnAmount = 0;
        this.level++;
        this.updateLevelText();
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
        var towerTile = game.add.button(pX, pY, 'tower_tile', this);
        towerTile.TilePX = pX;
        towerTile.TilePY = pY;
        towerTile.TileMX = mX;
        towerTile.TileMY = mY;
        tileMatrix[mX][mY] = towerTileNumber;
      }

      function placeTowerByMouse(pX, pY, mX, mY) {
        if (createScope.gold >= createScope.towerCost && tileMatrix[mX][mY] !== createScope.iceTowerTileNumber && tileMatrix[mX][mY] == towerTileNumber) {
          tileMatrix[mX][mY] = createScope.iceTowerTileNumber;
          createScope.towers.push(new tower(createScope.towerCount, createScope.game, pX, pY, createScope.towerBullets));
          createScope.towerCount++;
          createScope.updateGold(createScope.towerCost);
        } else {
          alert("You cannot place a tower there")
            // todo todo todo}
        }
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

      function insertTowersToBuy(game) {
        var iceTowerMenu = game.add.button(600, 70, 'tower_ice', null, this);
        var sprite = createScope.game.add.sprite(600, 70, 'tower_ice');
        sprite.inputEnabled = true;
        sprite.input.enableDrag();
        sprite.events.onDragStart.add(startDrag, this);
        sprite.events.onDragStop.add(stopDrag, this);
      }

      //      function dragIceTower(iceTowerMenu) {
      //        var sprite = createScope.game.add.sprite(1200, 20, 'tower_ice');
      //        sprite.inputEnabled = true;
      //        sprite.input.enableDrag();
      //        sprite.events.onDragStart.add(startDrag, this);
      //        sprite.events.onDragStop.add(stopDrag, this);
      //      }

      function startDrag(theSprite) {
        if (!createScope.canAffordIceTower) {
          theSprite.inputEnabled = false;
        } else {
          theSprite.inputEnabled = true;
        }
      }

      function stopDrag(theSprite) {
        var xPos = createScope.game.input.x;
        var yPos = createScope.game.input.y;
        var pX = Math.floor(xPos / 50) * 50;
        var pY = Math.floor(yPos / 50) * 50;
        var mX = pX / 50;
        var mY = pY / 50;
        placeTowerByMouse(pX, pY, mX, mY);
        theSprite.x = 600;
        theSprite.y = 70;
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

      function initializeLevel() {
        levelText = createScope.game.add.text(800, 20, 'Level: ' + createScope.level, {
          font: 'bold 24px Arial',
          fill: '#ffffff'
        });
      }

      function initializeTimer() {
        waveText = createScope.game.add.text(1000, 20, 'Next wave in : ' + createScope.waveTimer, {
          font: 'bold 24px Arial',
          fill: '#ffffff'
        });
      }

      function initializeMenuBar() {
        menuBarText = createScope.game.add.text(0, 110, '________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________', {
          font: 'bold 24px Arial',
          fill: '#ffffff'
        });
        menuBarText = createScope.game.add.text(0, 40, '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', {
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
      insertTowersToBuy(this.game);
      initializeGold();
      initializeHighscore();
      initializeHealth();
      initializeLevel();
      initializeTimer();
      initializeMenuBar();
      towerBullets();

      music = this.game.add.audio('bgmusic');
      music.play('', 0, 1, true);
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

    spawnCreeps: function () {
      console.log("WHILE CALLED")
      this.test2 = 0;
      var delauy = 500;
      var counter = 0;
      var localGameState = this.game.gameState;
      var testCreeps = this.creeps; 
      var finish = false;
      while (finish == false) { // spwan untill the amount is reached
        console.log("while");
        this.test2++;
        if (this.spawnAmount !== (this.level * 5)) {
          this.game.gameState.time.events.add(counter * delauy, function () {
          var newBunny = new bunny(localGameState.creepcount, localGameState.game, localGameState.points, localGameState.creepStartYPos, localGameState.pi)
  
          testCreeps.push(newBunny);
             localGameState.creepcount++;
              console.log("spawned creep");
            });
          counter++;
            //          if (this.test2 % 60 === 0) {
            //            this.creeps.push(new bunny(this.creepcount, this.game, this.points, this.creepStartYPos, this.pi))
            //            console.log("spawned creep");

          //          this.test2 = 0;
//         
          this.spawnAmount++;
        } else {
          finish = true;
          console.log("finished");
        }


      }
    },
    update: function () {
      if (this.test % 60 == 0) {

        if (this.waveTimer === 0) { //spwan next creepwave
          this.waveTimer = 11;

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
        this.towers[i].update(this.creeps, this.game);
        
      }

      this.test++;
    }
  };

  window['pixione'] = window['pixione'] || {};
  window['pixione'].GameState = GameState;

}());

tower = function (index, game, towerX, towerY, towerBullets, type) {
  this.kills = 0;
  this.upgradeAvailable = false;
  towerScope = this;
  this.index = index;
  this.game = game;
  this.towerX = towerX;
  this.towerY = towerY;

  this.damage = 5;
  this.radius = 250;
  this.towerSprite = this.game.add.sprite(this.towerX, this.towerY, 'tower_ice');
  this.firerate = 700;
  this.bulletSpeed = 250;
  this.upgradeCost = 50;

  this.bullets = towerBullets;
  this.nextFire = 0;


  this.towerSprite.anchor.set(0);
  this.towerSprite.inputEnabled = true;
  this.towerSprite.events.onInputDown.add(this.upgrade, this);
  //	this.towerSprite.scale(1,1);
  this.game.physics.arcade.enable(this.towerSprite);

  this.upgradePic = this.game.add.sprite(this.towerX, this.towerY, 'upgrade');
  this.upgradePic.visible = false;

  this.towerLevel = 1;
};

bulletHit = function (bunny, bullet) {
  bullet.kill();
  console.log(towerScope.game.gameState.creeps);
  var destroyed = towerScope.game.gameState.creeps[bunny.index].damage();
  if (destroyed) {
    bullet.shootingTower.kills++;
  }
};

tower.prototype.bulletOut = function (bullet) {
  bullet.kill();
  console.log("døøøøø");
}

tower.prototype.upgrade = function () {
  if (this.upgradeAvailable && this.game.gameState.gold >= this.upgradeCost) {
    this.firerate = this.firerate / 2;
    this.radius = this.radius * 2;
    this.damage++;
    this.towerSprite = this.game.add.sprite(this.towerX, this.towerY, 'tower_ice2');
    this.upgradePic.kill();
    this.upgradeAvailable = false;
    this.towerLevel++;
    this.game.gameState.updateGold(this.upgradeCost);
  }
}

tower.prototype.checkForUpgrade = function () {
  if (this.game.gameState.gold >= this.upgradeCost && this.towerLevel === 1) {
    this.upgradeAvailable = true;
    this.upgradePic.visible = true;
  } else {
    this.upgradePic.visible = false;
  }
}

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
        bullet.shootingTower = this;
        bullet.rotation = this.game.physics.arcade.moveToObject(bullet, creeps[i].creepSprite, this.bulletSpeed);
        console.log("update før out");
        bullet.checkWorldBounds = true;
        bullet.events.onOutOfBounds.add(this.bulletOut, this);

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
  this.creepSprite.animations.add('move', Phaser.Animation.generateFrameNames('kriecht e', 0, 3, '', 4), 30, true); //
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
    this.game.gameState.updateCurrency(this.score, this.gold);
    return this.kill();
  }
  return false;
};
bunny.prototype.kill = function () {
  this.alive = false;
  this.creepSprite.kill();

  return true;
}

bunny.prototype.update = function () {
  this.gametime++;
  this.creepSprite.x = this.path[this.pi].x;
  this.creepSprite.y = this.path[this.pi].y;
  this.pi++;
  if (this.pi >= this.path.length) {
    this.game.gameState.playerhealth--;
    this.kill();
    this.game.gameState.updateHealth();
    if (this.game.gameState.playerhealth <= 0) {
      this.game.gameState.gameOver();
    }
    this.pi = 0;
  }
};