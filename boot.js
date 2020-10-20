var bootState = {
    preload: function(){
        game.load.image('progressBar','assets/progressBar.png');
    },
    create: function(){
        game.stage.backgroundColor = '#ade6ff';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;

        game.state.start('load');
    }
};

