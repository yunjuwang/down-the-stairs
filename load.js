var loadState = {
    preload: function(){
        var loadingLabel = game.add.text(game.width/2, 150, 'loading...', {font: '25px Arial', fill: '#ffffff'});
        loadingLabel.anchor.setTo(0.5, 0.5);

        var progressBar = game.add.sprite(game.width/2, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        // Loat game sprites.
        game.load.image('background', 'assets/background.png');
        game.load.image('spike', 'assets/spike.png');
        game.load.image('wall', 'assets/wall.png');
        game.load.image('platform_normal', 'assets/platform1.png');
        game.load.image('platform_broken', 'assets/platform2.png');
        game.load.image('platform_spike', 'assets/platform3.png');
        game.load.image('particle', 'assets/particle.png');
        game.load.image('life_full', 'assets/life_full.png');
        game.load.image('life_empty', 'assets/life_empty.png');
        /// Load spritesheet
        game.load.spritesheet('player', 'assets/player.png', 39, 48);
        game.load.spritesheet('platform_spring', 'assets/spring.png', 130, 66);
        game.load.spritesheet('coin', 'assets/coin.png', 84, 84);
        // Load audio
        game.load.audio('stamp','assets/stamp.mp3');
        game.load.audio('jump','assets/jump.mp3');
        game.load.audio('break','assets/break.mp3');
        game.load.audio('damage','assets/damage.mp3');
        game.load.audio('fall','assets/fall.mp3');
        game.load.audio('coin','assets/coin.mp3');
        game.load.audio('BGM','assets/BGM.mp3');
    },
    create: function(){
        // BGM
        this.BGM = game.add.audio('BGM');
        this.BGM.play();
        game.state.start('menu');
    }
};

