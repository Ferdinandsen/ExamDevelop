var mainGame = (function () {
    'use strict';
    var game, ns = window['pixione'];

    return {
      startGame: function () {

            game = new Phaser.Game(1600, 800, Phaser.AUTO, 'pixione-game');

            game.state.add('boot', ns.Boot);
            game.state.add('preloader', ns.Preloader);
            game.state.add('menu', ns.Menu);
            game.state.add('game', ns.GameState);
            game.state.add('over', ns.Over);
					/* yo phaser:state new-state-files-put-here */

            game.state.start('boot');
      },
       endGame: function () {
            console.log('slut');
            game.destroy();
       }
    };
}());