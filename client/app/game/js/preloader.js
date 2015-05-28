(function () {
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
			this.load.image('background_tile', '../assets/images/dirt_tile.png');
			this.load.image('tower_tile', '../assets/images/buy_tower_tile.png');
			this.load.image('upgrade', '../assets/images/upgrade.png');
			this.load.image('tower_ice', '../assets/images/purchased_ice_tower_tile.png');
			this.load.image('tower_fire', '../assets/images/purchased_fire_tower_tile.png');
            this.load.image('tower_lightning', '../assets/images/purchased_lightning_tower_tile.png');
			this.load.image('tower_ice2', '../assets/images/purchased_ice_tower_upgraded_tile.png');
			this.load.image('tower_fire2', '../assets/images/purchased_fire_tower_upgraded_tile.png');
            this.load.image('tower_lightning2', '../assets/images/purchased_lightning_tower_upgraded_tile.png');

			this.load.image('path_tile', '../assets/images/path_tile2.png');
			this.load.image('background', '../assets/images/background.png');
			this.load.image("enemy", "../assets/images/enemy.png");

			this.load.image("tower_ice_bullet", "../assets/images/ice_projectile.png");
			this.load.image("tower_fire_bullet", "../assets/images/fire_projectile.png");
			this.load.image('tower_lightning_bullet', '../assets/images/lightning_projectile.png');
			this.load.image("bullet", "../assets/images/bullet.png");
            
			this.load.spritesheet('healthbar', '../assets/images/healthbar.png', 400, 50);

			this.load.spritesheet('menubuttons', '../assets/images/menubuttons.bmp', 512, 1024);
			this.load.atlas('rabbit', 'assets/images/rabbit.png', '../assets/fonts/rabbit.json');
            this.load.atlas('bossRabbit', 'assets/images/bossRabbit.png', '../assets/fonts/bossRabbit.json');
			
			this.load.bitmapFont('gul', '../assets/images/gul.png', '../assets/fonts/gul.fnt');
			this.load.bitmapFont('minecraftia', '../assets/images/minecraftia.png', '../assets/fonts/minecraftia.xml');
			this.load.audio('bgmusic', ['../assets/audio/bgMusic.mp3']);
			this.load.audio('mew', ['../assets/audio/mew.mp3']);
			this.load.audio('gameover', ['../assets/audio/gameover.wav']);

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


} ());
