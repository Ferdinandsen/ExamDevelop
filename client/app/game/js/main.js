window.onload = function () {
  'use strict';

  var game
    , ns = window['pixione'];
    var width  = 1600; 
    var height = 900;

  game = new Phaser.Game( width, height, Phaser.AUTO, 'pixione-game');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);
  game.state.add('over', ns.Over);
  /* yo phaser:state new-state-files-put-here */

  game.state.start('boot');
  
};
