(function () {
  'use strict';
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
  var damage = 5;
  var radius = 150;
  var firerate = 800; // højt tal = langsommere skud
  var bulletSpeed = 250; // højt tal = hurtigere skud
  var upgradeCost = 50;


  function Tower(index, gameState, towerX, towerY, towerBullets, towerType) {
    localGameState = gameState;

    index = index;
    Type = towerType;
    towerX = towerX;
    towerY = towerY;
    bullets = towerBullets;
    var tower = {
     
      index: index,
      gameState: localGameState,
      towerX: towerX,
      towerY: towerY,
      towerSprite: towerSprite,
      bullets: bullets,
      Type: towerType,

      checkForUpgrade: function () {
        if (localGameState.gold >= Tower.upgradeCost && towerLevel === 1) {
          upgradeAvailable = true;
          upgradePic.visible = true;
        } else {
          upgradePic.visible = false;
        }
      },
      update: function (creeps, game) {
        bullets.createMultiple(1, 'tower_fire_bullet'); //this.towerType + '_bullet'
        var test = (towerX + localGameState.tileSize / 2);
//       console.log("test 1 " + test);
        for (var i = 0; i < creeps.length; i++) {
          console.log("sprite x" + towerSprite.x);
          if (localGameState.game.physics.arcade.distanceBetween(towerSprite, creeps[i].creepSprite) < radius) {
            var bullet = bullets.getFirstExists(false);
            //        console.log("gametime: " + localGameState.game.time.now);
            //        console.log("nextFire: " + this.nextFire);
            if (creeps[i].alive && localGameState.game.time.now > nextFire) {
              nextFire = localGameState.game.time.now + firerate;
              localGameState.game.physics.arcade.enable(bullet);
//               console.log("skyd x 1 " + (towerX + localGameState.tileSize / 2));
//               
//               console.log("test" + test);
              bullet.reset(test, towerY + localGameState.tileSize / 2);
              bullet.anchor.set(0.5, 0.5);
              bullet.scale.set(0.5, 0.5);
              bullet.body.setSize(20, 20);
              bullet.shootingTower = this;
              bullet.rotation = localGameState.game.physics.arcade.moveToObject(bullet, creeps[i].creepSprite, bulletSpeed);
              bullet.checkWorldBounds = true;
              bullet.events.onOutOfBounds.add(Tower.prototype.bulletOut, this);
            }
            localGameState.game.physics.arcade.overlap(bullets, creeps[i].creepSprite, Tower.prototype.bulletHit, null, this); // this eller Tower?
          }
        }
      }
    };
    
    //        this.nextFire = 0;
    var kills = 0;
    //    console.log('start', index, gameState, towerX, towerY, towerBullets, towerType);
    
    //    var tower = (0, gameState, 50, 50, towerBullets, 'tower_ice');
    
    //    
    upgradePic = localGameState.game.add.sprite(towerX, towerY, 'upgrade');
    upgradePic.visible = false;

    //    //Towertype switch
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

  var test = function () {
    console.log("Mælk");
  };
  Tower.prototype.iceTowerProperties = function (tower) {
    damage = 5;
    radius = 150;
    nextFire = 0;
    console.log("sætter nu tårn x" + tower.towerX);
    towerSprite = localGameState.game.add.sprite(tower.towerX, tower.towerY, tower.Type);
    firerate = 800; // højt tal = langsommere skud
    bulletSpeed = 250; // højt tal = hurtigere skud
    upgradeCost = 50;
  };

  Tower.prototype.fireTowerProperties = function (tower) {
    console.log('fire tower...', tower);
    tower.damage = 3;
    tower.radius = 100;
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