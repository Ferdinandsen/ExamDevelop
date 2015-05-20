(function () {
  'use strict';
  var x;
  var localGameState;

  //  function Tower(index, gameState, towerX, towerY, towerBullets, towerType) {
  //
  //    x = tower(index, gameState, towerX, towerY, towerBullets, towerType);
  //
  //  }

  function Tower(index, gameState, towerX, towerY, towerBullets, towerType) {
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
    var upgradePic = gameState.game.add.sprite(towerX, towerY, 'upgrade');
    upgradePic.visible = false;
    var towerLevel = 1;
  
    //Towertype switch
    switch (towerType) {
      case gameState.iceTower:
        iceTowerProperties(tower);
        break;
      case gameState.fireTower:
        fireTowerProperties();
        break;
    }
    return tower;
    //        spriteSettings();
  };

  var iceTowerProperties = function (tower) {
    tower.damage = 5;
    tower.radius = 150;
    tower.towerSprite = localGameState.game.add.sprite(tower.towerX, tower.towerY, tower.towerType);
    tower.firerate = 800; // højt tal = langsommere skud
    tower.bulletSpeed = 250; // højt tal = hurtigere skud
    tower.upgradeCost = 50;
  }

  var fireTowerProperties = function (tower) {
    tower.damage = 3;
    tower.radius = 100;
    tower.towerSprite = tower.game.add.sprite(tower.towerX, tower.towerY, tower.towerType);
    tower.firerate = 1000;
    tower.bulletSpeed = 450;
    tower.upgradeCost = 10;
  }

  var spriteSettings = function () {
    x.towerSprite.anchor.set(0);
    towerSprite.inputEnabled = true;
    towerSprite.events.onInputDown.add(this.upgrade, this);
    //	this.towerSprite.scale(1,1);
    game.game.physics.arcade.enable(towerSprite);
  }
  var bulletOut = function (bullet) {
    bullet.kill();
  }

  var upgrade = function () {
    if (this.upgradeAvailable && this.game.gameState.gold >= this.upgradeCost) {
      this.towerLevel++;
      this.firerate = this.firerate / 2;
      this.radius = this.radius * 2;
      this.damage++;
      this.towerSprite = this.game.add.sprite(this.towerX, this.towerY, this.towerType + this.towerLevel);
      this.upgradePic.kill();
      this.upgradeAvailable = false;
      this.game.gameState.updateGold(this.upgradeCost);
    }
  }

  var checkForUpgrade = function () {
    if (this.game.gameState.gold >= this.upgradeCost && this.towerLevel === 1) {
      this.upgradeAvailable = true;
      this.upgradePic.visible = true;
    } else {
      this.upgradePic.visible = false;
    }
  }

  var update = function (creeps, game) {
    this.game.gameState.towerBullets.createMultiple(1, 'tower_fire_bullet'); //this.towerType + '_bullet'
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



  var bulletHit = function (bunny, bullet) {
    bullet.kill();
    var destroyed = towerScope.game.gameState.creeps[bunny.index].damage(bullet.shootingTower.damage);
    if (destroyed) {
      bullet.shootingTower.kills++;
    }
  };

  window['pixione'] = window['pixione'] || {};
  window['pixione'].Tower = Tower;

} ());