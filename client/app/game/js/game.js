(function () {
  'use strict';
      
  function Game() {
    
  }

  Game.prototype = {
    init: function(){
         this.game.wormSprite = {};
	},
    create: function () {
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
      
      function nextNumber() {
        scoreText.text = 'Score: ' + score.toString() + '\nBest Score: ' + topScore.toString();
        if (buttonMask) {
          buttonMask.destroy();
          game.tweens.removeAll();
        }
        buttonMask = game.add.graphics(game.world.centerX - 200, 250);
        buttonMask.beginFill(0xffffff);
        buttonMask.drawRect(0, 0, 400, 200);
        buttonMask.endFill();
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
	  music.play('',0,1,true);
      topScore = localStorage.getItem('topScore') === null ? 0 : localStorage.getItem('topScore');
      this.game.stage.backgroundColor = '#6a4c30';
      this.game.stage.disableVisibilityChange = true;
      for (var i = 1; i < 5; i++) {
        sumsArray[i] = [[], [], []];
        for (var j = 1; j <= 3; j++) {
          buildThrees(j, 1, i, j);
        }
      }
      game.wormSprite = game.add.sprite(0, game.world.centerY, 'worm');
      game.wormSprite.anchor.set(0.5);
      game.physics.arcade.enable(game.wormSprite);
      game.wormSprite.animations.add('run', Phaser.Animation.generateFrameNames('kriecht e', 0, 6, '', 4), 30, true);
      game.wormSprite.animations.play('run', 10, true);
      game.wormSprite.body.velocity.setTo(40, 0);
      game.wormSprite.checkWorldBounds = true;
      game.wormSprite.events.onOutOfBounds.add(wormSpriteOut, this);
            
      questionText = this.game.add.text(game.world.centerX, 160, '-', {
        font: 'bold 72px Arial'
      });
      questionText.anchor.set(0.5);
      scoreText = this.game.add.text(game.world.centerX - 100, 10, '-', {
        font: 'bold 24px Arial'
      });
      
      for (var k = 0; k < 3; k++) {
        var button = this.game.add.button(this.game.world.centerX - 200, 250 + k * 75, 'buttons', checkAnswer, this);
        button.frame = k;
        button.input.useHandCursor = true;
      }
      numberTimer = this.game.add.sprite(this.game.world.centerX - 200, 250, 'timebar');
      nextNumber();

      function gameOver() {
        isGameOver = true;
        localStorage.setItem('topScore', Math.max(score, topScore));
        music.stop();
        game.state.start('over', true, false, score);
      }
      
     
     
    },
    update:function (){
      

    }
    

  };
  
  window['pixione'] = window['pixione'] || {};
  window['pixione'].Game = Game;
 
  
}());