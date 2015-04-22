(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      
      this.loadResources();
    },
      
    loadResources: function () {
        this.load.image('background_tile', 'assets/background_tile.png');
        this.load.image('tower_tile', 'assets/tower_tile.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('timebar', 'assets/timebar.png');
		this.load.image('buttonmask', 'assets/buttonmask.png');
		this.load.spritesheet('buttons', 'assets/buttons.png',400,50);
	    this.load.spritesheet('menubuttons', 'assets/menubuttons.bmp',512, 1024);
	    this.load.atlas('worm', 'assets/worm.png', 'assets/worm.json');
        this.load.atlas('death', 'assets/death.png', 'assets/death.json');
        this.load.bitmapFont('gul', 'assets/gul.png', 'assets/gul.fnt');
        this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
        this.load.audio('bgmusic', ['assets/audio/bgMusic.ogg']);
        this.load.audio('buttonGood', ['assets/audio/buttongood.ogg']);
        this.load.audio('buttonBad', ['assets/audio/buttonbad.wav']);
        this.load.audio('gameover', ['assets/audio/gameover.wav']);

    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['pixione'] = window['pixione'] || {};
  window['pixione'].Preloader = Preloader;

}());
