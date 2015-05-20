(function () {
  'use strict';
  var x;
  var localGameState;
  var upgradePic;

  //  function Tower(index, gameState, towerX, towerY, towerBullets, towerType) {
  //
  //    x = tower(index, gameState, towerX, towerY, towerBullets, towerType);
  //
  //  }

  function Tower(index, gameState, towerX, towerY, towerBullets, towerType) {
    console.log('start', index, gameState, towerX, towerY, towerBullets, towerType);
    localGameState = gameState;
    var tower = {};

    var towerSprite;
    var kills = 0;
    var upgradeAvailable = false;
    var index = index;
    var gameState = gameState;
    var towerX = towerX;
    var towerY = towerY;
    var towerType = towerType;
    var bullets = towerBullets;
    var nextFire = 0;
    upgradePic = gameState.game.add.sprite(towerX, towerY, 'upgrade');
    upgradePic.visible = false;
    var towerLevel = 1;
  
    //Towertype switch
    switch (towerType) {
      case gameState.iceTower:
        Tower.prototype.iceTowerProperties(tower);
        break;
      case gameState.fireTower:
        Tower.prototype.fireTowerProperties();
        break;
    }
    return tower;
            Tower.prototype.spriteSettings();
  };


  Tower.prototype.iceTowerProperties = function (tower) {
    console.log('ice tower...', tower);
    tower.damage = 5;
    tower.radius = 150;
    tower.towerSprite = localGameState.game.add.sprite(tower.towerX, tower.towerY, tower.towerType);
    tower.firerate = 800; // højt tal = langsommere skud
    tower.bulletSpeed = 250; // højt tal = hurtigere skud
    tower.upgradeCost = 50;
  }

  Tower.prototype.fireTowerProperties = function (tower) {
    console.log('fire tower...', tower);
    tower.damage = 3;
    tower.radius = 100;
    tower.towerSprite = tower.game.add.sprite(tower.towerX, tower.towerY, tower.towerType);
    tower.firerate = 1000;
    tower.bulletSpeed = 450;
    tower.upgradeCost = 10;
  }

  Tower.prototype.spriteSettings = function () {
    console.log('spriteSetting...');
    x.towerSprite.anchor.set(0);
    x.towerSprite.inputEnabled = true;
    x.towerSprite.events.onInputDown.add(this.upgrade, this);
    //	this.towerSprite.scale(1,1);
    game.game.physics.arcade.enable(towerSprite);
  }
  Tower.prototype.bulletOut = function (bullet) {
    bullet.kill();
  }

  Tower.prototype.upgrade = function () {
    console.log('upgrade');
    if (this.upgradeAvailable && this.game.gameState.gold >= this.upgradeCost) {
      this.towerLevel++;
      this.firerate = this.firerate / 2;
      this.radius = this.radius * 2;
      this.damage++;
      this.towerSprite = this.game.add.sprite(this.towerX, this.towerY, this.towerType + this.towerLevel);
      upgradePic.kill();
      upgradeAvailable = false;
      this.game.gameState.updateGold(this.upgradeCost);
    }
  }

  Tower.prototype.checkForUpgrade = function (index) {
    if (localGameState.gold >= this.upgradeCost && this.towerLevel === 1) {
      upgradeAvailable = true;
      upgradePic.visible = true;
    } else {
      upgradePic.visible = false;
    }
  }

  Tower.prototype.update = function (creeps, game) {
    localGameState.towerBullets.createMultiple(1, 'tower_fire_bullet'); //this.towerType + '_bullet'
    for (var i = 0; i < creeps.length; i++) {
      if (game.physics.arcade.distanceBetween(this.towerSprite, creeps[i].creepSprite) < this.radius) {
        var bullet = this.bullets.getFirstExists(false);
        if (creeps[i].alive && this.game.time.now > this.nextFire) {
          this.nextFire = this.game.time.now + this.firerate;
          game.physics.arcade.enable(bullet);
          bullet.reset(this.towerX + this.game.gameState.tileSize / 2, this.towerY + this.game.gameState.tileSize / 2);
          bullet.anchor.set(0.5, 0.5);
          bullet.scale.set(0.5, 0.5);
          bullet.body.setSize(20, 20);
          bullet.shootingTower = this;
          bullet.rotation = this.game.physics.arcade.moveToObject(bullet, creeps[i].creepSprite, this.bulletSpeed);
          bullet.checkWorldBounds = true;
          bullet.events.onOutOfBounds.add(this.bulletOut, this);
          //				this.game.physics.arcade.overlap(this.bullets, creeps[i].creepSprite, bulletHit, null, null);
        }
        this.game.physics.arcade.overlap(this.bullets, creeps[i].creepSprite, bulletHit, null, this);
      }
    }
  };



  Tower.prototype.bulletHit = function (bunny, bullet) {
    bullet.kill();
    var destroyed = towerScope.game.gameState.creeps[bunny.index].damage(bullet.shootingTower.damage);
    if (destroyed) {
      bullet.shootingTower.kills++;
    }
  };

  window['pixione'] = window['pixione'] || {};
  window['pixione'].Tower = Tower;

} ());