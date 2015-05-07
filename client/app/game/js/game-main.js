var mainGame = (function () {
    'use strict';
    
    return {
      startGame: function () {
            var game, ns = window['pixione'];

            game = new Phaser.Game(1600, 900, Phaser.AUTO, 'pixione-game');
            game.state.add('boot', ns.Boot);
            game.state.add('preloader', ns.Preloader);
            game.state.add('menu', ns.Menu);
            game.state.add('game', ns.GameState);
            game.state.add('over', ns.Over);
				
					/* yo phaser:state new-state-files-put-here */

            game.state.start('boot');
      }
//        ,
//         endGame: function () {
//             console.log('slut');
//        }
    };
}());