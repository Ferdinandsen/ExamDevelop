(function () {
  'use strict';


  var localGameState;

  function Tower(index, gameState, towerX, towerY, towerBullets, towerType) {
    localGameState = gameState;
    var localType = towerType;
    var tower = {

      index: index,
      gameState: localGameState,
      towerX: towerX,
      towerY: towerY,
      towerSprite: undefined,
      bullets: towerBullets,
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

      checkForUpgrade: function (tower) {
        if (localGameState.gold >= tower.upgradeCost && tower.towerLevel === 1) {
          tower.upgradeAvailable = true;
          tower.upgradePic.visible = true;
        } else {
          tower.upgradePic.visible = false;
        }
      },

      update: function (creeps, tower) {
        this.bullets.createMultiple(1, 'tower_fire_bullet');
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

  Tower.prototype.iceTowerProperties = function (tower) {
    tower.damage = 5;
    tower.radius = 150;
    tower.nextFire = 0;
    tower.towerSprite = localGameState.game.add.sprite(tower.towerX, tower.towerY, tower.Type);
    tower.firerate = 800; // højt tal = langsommere skud
    tower.bulletSpeed = 450; // højt tal = hurtigere skud
    tower.upgradeCost = 50;
    tower.towerLevel = 1;
    tower.upgradeAvailable = false;
  };

  Tower.prototype.fireTowerProperties = function (tower) {
    tower.damage = 3;
    tower.radius = 200;
    tower.nextFire = 0;
    tower.towerSprite = localGameState.game.add.sprite(tower.towerX, tower.towerY, tower.Type);
    tower.firerate = 1000;
    tower.bulletSpeed = 450;
    tower.upgradeCost = 40;
    tower.towerLevel = 1;
    tower.upgradeAvailable = false;
  };
      Tower.prototype.lightningTowerProperties = function (tower) {
    tower.damage = 1;
    tower.radius = 300;
    tower.nextFire = 0;
    tower.towerSprite = localGameState.game.add.sprite(tower.towerX, tower.towerY, tower.Type);
    tower.firerate = 400; // højt tal = langsommere skud
    tower.bulletSpeed = 600; // højt tal = hurtigere skud
    tower.upgradeCost = 50;
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
      towerSprite.theTower.radius = towerSprite.theTower.radius * 2;
      towerSprite.theTower.damage++;
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


  //  Tower.prototype.upgrade = function () {
  //    if (upgradeAvailable && localGameState.gold >= Tower.upgradeCost) {
  //      towerLevel++;
  //      Tower.firerate = Tower.firerate / 2;
  //      Tower.radius = Tower.radius * 2;
  //      Tower.damage++;
  //      Tower.towerSprite = localGameState.add.sprite(Tower.towerX, Tower.towerY, Tower.Type + Tower.towerLevel);
  //      upgradePic.kill();
  //      upgradeAvailable = false;
  //      localGameState.updateGold(Tower.upgradeCost);
  //    }
  //  };


  //  Tower.prototype.update = function (creeps, game) {
  //    bullets.createMultiple(1, 'tower_fire_bullet'); //this.towerType + '_bullet'
  //    for (var i = 0; i < creeps.length; i++) {
  //      //      console.log("radius: ", this.radius);
  //      if (localGameState.game.physics.arcade.distanceBetween(this.towerSprite, creeps[i].creepSprite) < this.radius) {
  //        var bullet = bullets.getFirstExists(false);
  //        //        console.log("gametime: " + localGameState.game.time.now);
  //        //        console.log("nextFire: " + this.nextFire);
  //        if (creeps[i].alive && localGameState.game.time.now > this.nextFire) {
  //          this.nextFire = localGameState.game.time.now + this.firerate;
  //          localGameState.game.physics.arcade.enable(bullet)
  //          bullet.reset(this.towerX + localGameState.tileSize / 2, this.towerY + localGameState.tileSize / 2);
  //          bullet.anchor.set(0.5, 0.5);
  //          bullet.scale.set(0.5, 0.5);
  //          bullet.body.setSize(20, 20);
  //          bullet.shootingTower = this;
  //          bullet.rotation = localGameState.game.physics.arcade.moveToObject(bullet, creeps[i].creepSprite, this.bulletSpeed);
  //          bullet.checkWorldBounds = true;
  //          bullet.events.onOutOfBounds.add(this.bulletOut, this);
  //        }
  //        localGameState.game.physics.arcade.overlap(bullets, creeps[i].creepSprite, this.bulletHit, null, this); // this eller Tower?
  //      }
  //    }
  //  };

  