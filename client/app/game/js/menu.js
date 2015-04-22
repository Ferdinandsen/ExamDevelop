(function () {
    'use strict';

    function Menu() {
        this.titleTxt = null;
        this.startTxt = null;
    }

    Menu.prototype = {

        create: function () {
            var x = this.game.width / 2,
                y = this.game.height / 2,
                key = this.game.input.keyboard.addKey(Phaser.Keyboard.N);

            this.titleTxt = this.add.bitmapText(x, y, 'gul', 'Dr. Evils Dangerous Bunnies', 48);
            this.titleTxt.align = 'center';
            this.titleTxt.x = this.game.width / 2 - this.titleTxt.textWidth / 2;

            y = y + this.titleTxt.height + 5;
            this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'Press "N" to start the game');
            this.startTxt.align = 'center';
            this.startTxt.x = this.game.width / 2 - this.startTxt.textWidth / 2;
            //            Legacy! fra Lars 
            //            this.input.onDown.add(this.onDown, this);
            key.onDown.add(this.startGame, this);
        },
        startGame: function () {
            this.game.state.start('game');
        },

        //        Legacy! fra Lars
        //        onDown: function () {
        //              this.game.state.start('game');
        //        }
    };

    window['pixione'] = window['pixione'] || {};
    window['pixione'].Menu = Menu;

}());