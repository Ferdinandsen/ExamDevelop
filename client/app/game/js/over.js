(function () {
  'use strict';

  function Over() {
  }


  Over.prototype = {
    init: function(endScore){
         this.game.score = endScore;
	},
    create: function() {
      var score = this.game.score;
      this.game.stage.backgroundColor = '#6a4c30';
      this.game.add.audio('gameover').play();
            
      var s = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 100, 'death');
      s.anchor.setTo(0.5, 0.5);
      s.animations.add('run');
      s.animations.play('run', 6, true);
      s.scale.setTo(2, 2);
      
      this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
     
    
      var label = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '\nGAME OVER\nDu fik: '+ score+'\nClick or tab to restart',{ font: '20px Lucida Console', fill: '#fff', align: 'center'});
      label.anchor.setTo(0.5, 0.5);
    },

    update: function() {
      if (this.game.input.activePointer.isDown){
        this.game.state.start('game');
      }
    }
  };


  window['pixione'] = window['pixione'] || {};
  window['pixione'].Over = Over;

}());