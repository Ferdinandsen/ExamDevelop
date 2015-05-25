(function () {
  'use strict';


  var localGameState;

  function Tower(index, gameState, towerX, towerY, towerType) {
    localGameState = gameState;
    var localType = towerType;
    var tower = {

      index: index,
      gameState: localGameState,
      towerX: towerX,
      towerY: towerY,
      towerSprite: undefined,
      bullets: Tower.prototype.towerBullets(localGameState),
      Type: towerType,
      towerLevel: undefined,
      upgradeAvailable: false,
      nextFire: undefined,
      damage: undefined,
      radius: undefined,
      firerate: undefined, // højt tal = langsommere skud
      bulletSpeed: undefined, // højt tal = hurtigere skud
      upgradeCost: undefined,
      kills: 0,
      upgradePic: localGameState.game.add.sprite(towerX, towerY, 'upgrade'),

      checkForUpgrade: function () {
        if (localGameState.gold >= this.upgradeCost && this.towerLevel === 1) {
          this.upgradeAvailable = true;
          this.upgradePic.visible = true;
        } else {
          this.upgradePic.visible = false;
        }
      },

      update: function (creeps, tower) {
        this.bullets.createMultiple(1, this.Type + '_bullet');
        for (var i = 0; i < creeps.length; i++) {
          if (localGameState.game.physics.arcade.distanceBetween(this.towerSprite, creeps[i].creepSprite) < this.radius) {
            var bullet = this.bullets.getFirstExists(false);
            if (creeps[i].alive && localGameState.game.time.now > this.nextFire) {
              this.nextFire = localGameState.game.time.now + this.firerate;
              localGameState.game.physics.arcade.enable(bullet);
              bullet.reset(this.towerX + localGameState.tileSize / 2, this.towerY + localGameState.tileSize / 2);
              bullet.anchor.set(0.5, 0.5);
              bullet.scale.set(0.5, 0.5);
              bullet.body.setSize(20, 20);
              bullet.shootingTower = this;
              bullet.rotation = localGameState.game.physics.arcade.moveToObject(bullet, creeps[i].creepSprite, this.bulletSpeed);
              bullet.checkWorldBounds = true;
              bullet.events.onOutOfBounds.add(Tower.prototype.bulletOut, this);
            }
            localGameState.game.physics.arcade.overlap(this.bullets, creeps[i].creepSprite, Tower.prototype.bulletHit, null, this); // this eller Tower?
          }
        }
      }
    };

    //    //Towertype switch
    switch (localType) {
      case gameState.iceTower:
        Tower.prototype.iceTowerProperties(tower);
        break;
      case gameState.fireTower:
        Tower.prototype.fireTowerProperties(tower);
        break;
      case gameState.lightningTower:
                Tower.prototype.lightningTowerProperties(tower);
                break;
    }
    Tower.prototype.spriteSettings(tower);
    return tower;

  };

    Tower.prototype.towerBullets = function (localGameState) {
        var towerBullets;
        towerBullets = localGameState.game.add.group();
        towerBullets.enableBody = true;
        towerBullets.physicsBodyType = Phaser.Physics.ARCADE;
        return towerBullets;
    };

  Tower.prototype.iceTowerProperties = function (tower) {
    tower.damage = 5;
    tower.radius = 150;
    tower.nextFire = 0;
    tower.towerSprite = localGameState.game.add.sprite(tower.towerX, tower.towerY, tower.Type);
    tower.firerate = 800; // højt tal = langsommere skud
    tower.bulletSpeed = 150; // højt tal = hurtigere skud
    tower.upgradeCost = 10;
    tower.towerLevel = 1;
    tower.upgradeAvailable = false;
  };

  Tower.prototype.fireTowerProperties = function (tower) {
    tower.damage = 7;
    tower.radius = 185;
    tower.nextFire = 0;
    tower.towerSprite = localGameState.game.add.sprite(tower.towerX, tower.towerY, tower.Type);
    tower.firerate = 900;
    tower.bulletSpeed = 185;
    tower.upgradeCost = 15;
    tower.towerLevel = 1;
    tower.upgradeAvailable = false;
  };
    Tower.prototype.lightningTowerProperties = function (tower) {
    tower.damage = 8;
    tower.radius = 185;
    tower.nextFire = 0;
    tower.towerSprite = localGameState.game.add.sprite(tower.towerX, tower.towerY, tower.Type);
    tower.firerate = 600; // højt tal = langsommere skud
    tower.bulletSpeed = 400; // højt tal = hurtigere skud
    tower.upgradeCost = 20;
    tower.towerLevel = 1;
    tower.upgradeAvailable = false;
  };

  Tower.prototype.spriteSettings = function (tower) {
    tower.towerSprite.anchor.set(0);
    tower.towerSprite.theTower = tower; //our sprite knows which obj it belongs to. It is used in upgrade
    tower.towerSprite.inputEnabled = true;
    tower.towerSprite.events.onInputDown.add(this.upgrade, { tower: tower });
    //	this.towerSprite.scale(1,1);
    localGameState.game.physics.arcade.enable(tower.towerSprite);
  };

  Tower.prototype.bulletOut = function (bullet) {
    bullet.kill();
  };

  Tower.prototype.upgrade = function (towerSprite) {
    if (towerSprite.theTower.upgradeAvailable && localGameState.gold >= towerSprite.theTower.upgradeCost) {
      towerSprite.theTower.towerLevel++;
      towerSprite.theTower.firerate = towerSprite.theTower.firerate / 2;
      towerSprite.theTower.radius = towerSprite.theTower.radius * 1.1;
      towerSprite.theTower.damage = towerSprite.theTower.damage * 1.5;
      towerSprite.theTower.towerSprite = localGameState.add.sprite(towerSprite.theTower.towerX, towerSprite.theTower.towerY, towerSprite.theTower.Type + towerSprite.theTower.towerLevel);
      towerSprite.theTower.upgradePic.kill();
      towerSprite.theTower.upgradeAvailable = false;
      localGameState.updateGold(towerSprite.theTower.upgradeCost);
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

} ());


  