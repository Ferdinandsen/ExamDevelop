(function () {
  'use strict';
  var x;
  var localGameState;
  var upgradePic;
  var towerLevel = 1;
  var upgradeAvailable = false;
  var towerSprite;
  var bullets;
  var Type;
  var nextFire = 0;
  var towerX;
  var towerY;
  var index;
  function Tower(index, gameState, towerX, towerY, towerBullets, towerType) {
    localGameState = gameState;
    
    //    index = index;
    //    Type = towerType;
    //    towerX = towerX;
    //    towerY = towerY;
    //    bullets = towerBullets;
    
    var tower = {
      index: index,
      gameState: localGameState,
      towerX: towerX,
      towerY: towerY,
      bullets: towerBullets,
      Type: towerType,
      checkForUpgrade: function () {
        if (localGameState.gold >= Tower.upgradeCost && towerLevel === 1) {
          console.log('if i upgrade', Tower.upgradeAvailable);
          console.log('if i upgrade - this', this.upgradeAvailable);
          Tower.upgradeAvailable = true;
          Tower.upgradePic.visible = true;
        } else {
          upgradePic.visible = false;
        }
      }
    };

    nextFire = 0;
    var kills = 0;
    //    console.log('start', index, gameState, towerX, towerY, towerBullets, towerType);
    
    //    var tower = (0, gameState, 50, 50, towerBullets, 'tower_ice');
    
    
    upgradePic = localGameState.game.add.sprite(towerX, towerY, 'upgrade');
    upgradePic.visible = false;
    
  
    //Towertype switch
    switch (Type) {
      case gameState.iceTower:
        Tower.prototype.iceTowerProperties(tower);
        break;
      case gameState.fireTower:
        Tower.prototype.fireTowerProperties();
        break;
    }
    return tower;
    //    Tower.prototype.spriteSettings();
  };


  Tower.prototype.iceTowerProperties = function (tower) {
    console.log('ice tower...', tower);
    tower.damage = 5;
    tower.radius = 150;
    tower.towerSprite = localGameState.game.add.sprite(tower.towerX, tower.towerY, tower.Type);
    console.log('ice tower sprite', tower.towerSprite);
    tower.firerate = 800; // højt tal = langsommere skud
    tower.bulletSpeed = 250; // højt tal = hurtigere skud
    tower.upgradeCost = 50;
  };

  Tower.prototype.fireTowerProperties = function (tower) {
    console.log('fire tower...', tower);
    Tower.damage = 3;
    Tower.radius = 100;
    Tower.towerSprite = tower.game.add.sprite(tower.towerX, tower.towerY, tower.Type);
    Tower.firerate = 1000;
    Tower.bulletSpeed = 450;
    Tower.upgradeCost = 10;
  };

  Tower.prototype.spriteSettings = function () {
    console.log('spriteSetting...');
    Tower.towerSprite.anchor.set(0);
    Tower.towerSprite.inputEnabled = true;
    Tower.towerSprite.events.onInputDown.add(this.upgrade, this);
    //	this.towerSprite.scale(1,1);
    localGameState.game.physics.arcade.enable(Tower.towerSprite);
  };

  Tower.prototype.bulletOut = function (bullet) {
    bullet.kill();
  };

  Tower.prototype.upgrade = function () {
    console.log('upgrade');
    if (upgradeAvailable && localGameState.gold >= Tower.upgradeCost) {
      towerLevel++;
      Tower.firerate = Tower.firerate / 2;
      Tower.radius = Tower.radius * 2;
      Tower.damage++;
      Tower.towerSprite = localGameState.add.sprite(Tower.towerX, Tower.towerY, Tower.Type + Tower.towerLevel);
      upgradePic.kill();
      upgradeAvailable = false;
      localGameState.updateGold(Tower.upgradeCost);
    }
  };

  Tower.prototype.upgrade = function () {
    if (upgradeAvailable && localGameState.gold >= Tower.upgradeCost) {
      towerLevel++;
      Tower.firerate = Tower.firerate / 2;
      Tower.radius = Tower.radius * 2;
      Tower.damage++;
      Tower.towerSprite = localGameState.add.sprite(Tower.towerX, Tower.towerY, Tower.Type + Tower.towerLevel);
      upgradePic.kill();
      upgradeAvailable = false;
      localGameState.updateGold(Tower.upgradeCost);
    }
  };


  Tower.prototype.update = function (creeps, game) {
    console.log('Jeg er inde i Tower.prototype.update');
    bullets.createMultiple(1, 'tower_fire_bullet'); //this.towerType + '_bullet'
    for (var i = 0; i < creeps.length; i++) {
      if (game.physics.arcade.distanceBetween(towerSprite, creeps[i].creepSprite) < Tower.radius) {
        console.log('if 1 i update');
        var bullet = bullets.getFirstExists(false);
        if (creeps[i].alive && localGameState.time.now > nextFire) {
          console.log('if 2 i update');
          nextFire = localGameState.time.now + Tower.firerate;
          localGameState.physics.arcade.enable(bullet);
          bullet.reset(Tower.towerX + localGameState.tileSize / 2, Tower.towerY + localGameState.tileSize / 2);
          bullet.anchor.set(0.5, 0.5);
          bullet.scale.set(0.5, 0.5);
          bullet.body.setSize(20, 20);
          bullet.shootingTower = this;
          bullet.rotation = localGameState.physics.arcade.moveToObject(bullet, creeps[i].creepSprite, Tower.bulletSpeed);
          bullet.checkWorldBounds = true;
          bullet.events.onOutOfBounds.add(Tower.prototype.bulletOut, this);
          //				this.game.physics.arcade.overlap(this.bullets, creeps[i].creepSprite, bulletHit, null, null);
        }
        localGameState.physics.arcade.overlap(bullets, creeps[i].creepSprite, Tower.prototype.bulletHit, null, this); // this eller Tower?
      }
    };

    Tower.prototype.bulletHit = function (bunny, bullet) {
      bullet.kill();
      var destroyed = localGameState.creeps[bunny.index].damage(bullet.shootingTower.damage);
      if (destroyed) {
        bullet.shootingTower.kills++;
      }
    };

    window['pixione'] = window['pixione'] || {};
    window['pixione'].Tower = Tower;

  };
} ());