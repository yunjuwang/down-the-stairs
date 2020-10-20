var playState = {

    create: function() {
        game.add.image(0, 0, 'background');

        this.cursor = game.input.keyboard.createCursorKeys();
        
        //player
        this.player = game.add.sprite(game.width/2, 30, 'player');
        this.player.facingLeft = false;
        this.player.life = 5;
        this.player.unbeatableTime = 0;
        this.player.died = false;

        ///Add animations.
        this.player.animations.add('rightwalk', [1,3], 8, true);
        this.player.animations.add('leftwalk', [4,6], 8, true);

        /// Particle
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('particle');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.setScale(1, 0, 1, 0, 800);
        this.emitter.gravity = 500;

        // Show score
        this.scoreLabel = game.add.text(402, 36, 'Score\n0', { font: '25px Arial', fill: '#000000' });
        this.score = 0;

        //Life
        this.lives_full = game.add.group();
        this.lives_empty = game.add.group();
        for(var i = 0; i < 5; i++){
            game.add.sprite(30 + i * 38, 36, 'life_full', 0, this.lives_full);
            game.add.sprite(30 + i * 38, 36, 'life_empty', 0, this.lives_empty);
        }

        // Sounds
        this.stampSound = game.add.audio('stamp');
        this.jumpSound = game.add.audio('jump');
        this.breakSound = game.add.audio('break');
        this.damageSound = game.add.audio('damage');
        this.fallSound = game.add.audio('fall');
        this.coinSound = game.add.audio('coin');

        /// Add spike
        this.spike = game.add.sprite(0, 0, 'spike'); 
        game.physics.arcade.enable(this.spike);
        this.spike.enableBody = true;
        this.spike.body.immovable = true;

        /// Add wall
        this.walls = game.add.group();
        this.walls.enableBody = true;
        game.add.sprite(-50, 0, 'wall', 0, this.walls); 
        game.add.sprite(480, 0, 'wall', 0, this.walls); 
        this.walls.setAll('body.immovable', true);

        //Add coin
        this.coins = game.add.group();
        this.coins.enableBody = true;

        /// Add platform
        this.platforms = game.add.group();
        this.platforms.enableBody = true;
        
        //first platform
        this.firstPlatform = game.add.sprite(180, 450, 'platform_normal', 0, this.platforms); 
        this.firstPlatform.body.velocity.y = -140;

        this.platforms.setAll('body.immovable', true);

        game.time.events.loop(1000, function(){
            game.time.events.add( game.rnd.between(0,600),this.addPlatform); 
        } , this);
        game.time.events.loop(3000, function(){
            game.time.events.add( game.rnd.between(0,1000),this.addCoin); 
        } , this);

       // game.time.events.loop(game.rnd.between(600,1500), this.addPlatform, this);
       // game.time.events.loop(game.rnd.between(2000,5000), this.addCoin, this);

        game.physics.arcade.enable(this.player);
        // Add vertical gravity to the player
        this.player.body.gravity.y = 500;

    },

    update: function() {
        
        game.physics.arcade.overlap(this.platforms, this.coins,function(platform,coin){coin.kill()},null,this);
        if(!this.player.died) game.physics.arcade.overlap(this.player, this.coins,this.coinEffect,null,this);
        game.physics.arcade.collide(this.player, this.walls);
        if(!this.player.died) game.physics.arcade.collide(this.player, this.platforms,this.platformEffect,null,this);

        game.physics.arcade.collide(this.player, this.spike,this.hitCeiling,null,this);


        if (!this.player.inWorld) { 
            this.playerDie();
        }
        this.movePlayer();

        if(this.player.died) this.scoreLabel.text='';
        else this.scoreLabel.text='Score\n' + this.score;

    }, 
    hitCeiling: function(){
     
        if(this.player.body.velocity.y < 0) {
            this.player.body.velocity.y = 0;
        }
        if(game.time.now > this.player.unbeatableTime) {
            this.lostLife();
            this.player.unbeatableTime = game.time.now + 100;
        }
    },

    addPlatform: function(){

        if(!playState.player.died){
            var platform;
            var x = game.rnd.between(100,400);
            var y = 600;
            var rand = game.rnd.between(0,100);
    
            if(rand<40){
                platform = game.add.sprite(x, y, 'platform_normal', 0, playState.platforms); 
            }
            else if(rand<60){
                platform = game.add.sprite(x, y, 'platform_broken', 0, playState.platforms); 
            }
            else if(rand<80){
                platform = game.add.sprite(x, y, 'platform_spike', 0, playState.platforms); 
            }
            else{
                platform = game.add.sprite(x, y, 'platform_spring', 0, playState.platforms); 
                platform.animations.add('spring', [2,1,0,1,2], 20, false);
                platform.frame = 2;
            }
            platform.anchor.setTo(0.5, 0); 
    
            game.physics.arcade.enable(platform);
            platform.body.immovable = true;
    
            platform.body.velocity.y = -140;
            platform.checkWorldBounds = true;
            platform.outOfBoundsKill = true;
            
            platform.body.checkCollision.down = false;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;
    
            playState.score += 10;
            
        }
    },
    
    addCoin: function(){

        if(!playState.player.died){
            var coin;
            var x = game.rnd.between(100,400);
            var y = 620;

            coin = game.add.sprite(x, y, 'coin', 0, playState.coins); 
            coin.animations.add('coin', [0,1,2,3,2,1], 8, true);
            coin.animations.play('coin');  
            
            coin.scale.setTo(0.5, 0.5); 
            coin.anchor.setTo(0.5, 0.5); 
    
            game.physics.arcade.enable(coin);
            coin.body.immovable = true;
    
            coin.body.velocity.y = -140;
            coin.checkWorldBounds = true;
            coin.outOfBoundsKill = true;
    
        }
    },
    coinEffect: function(player,coin){
        this.coinSound.play();
        coin.kill();

        this.score += 200;
        if(this.score > game.global.score) game.global.score = this.score;
    },
    addLife: function(player,platform) {
        if(this.player.life<0){}
        else if(this.player.life<5 && this.player.life>0){
            
            this.lives_full.getChildAt(this.player.life).visible = true;
            this.player.life += 1;
        } 
        
    },
    lostLife: function(player,platform) {
        this.damageSound.play();
        this.player.life -= 1;
        if(this.player.life<0){}
        else if(this.player.life==0){
            this.lives_full.getChildAt(0).visible = false;
            this.playerDie();
        } 
        else this.lives_full.getChildAt(this.player.life).visible = false;
        game.camera.flash(0xff0000, 100);
    },

    platformEffect: function(player,platform) {

        if(platform.key=='platform_normal'){
            
            if (player.prvPlatform !== platform) {
                this.addLife();
                this.stampSound.play();
                player.prvPlatform = platform;
            }
        }
        else if(platform.key=='platform_broken') {
            //if (player.prvPlatform !== platform) {
                this.addLife();
                this.breakSound.play();

                this.emitter.x = platform.x;
                this.emitter.y = platform.y;
                this.emitter.start(true,800,null,15);
    
                platform.kill();
    
                player.prvPlatform = platform;
           // }
        }
        else if(platform.key=='platform_spike') {

            platform.body.setSize(130, 33, 0, 15);

            if (player.prvPlatform !== platform) {
                this.lostLife();
                player.prvPlatform = platform;
            }

        }
        else if (platform.key=='platform_spring') {        
            player.body.velocity.y = -400;
            platform.animations.play('spring');    

            this.jumpSound.play();

            if (player.prvPlatform !== platform) {
                this.addLife();
                player.prvPlatform = platform;
            }

        }
      
    },

    playerDie: function() { 
        if(!this.player.died){

            
            if (!this.player.inWorld) { 
                this.fallSound.play();
            }

            //Show final score
            var finalScoreLabel = game.add.text(game.width/2, 200, 
                'Final Score', {font: '28px 微軟正黑體', fill: '#000000'});
            finalScoreLabel.anchor.setTo(0.5, 0.5);

            var finalScoreLabel_ = game.add.text(game.width/2, 280, 
                this.score, {font: '90px 微軟正黑體', fill: '#ffffff'});
            finalScoreLabel_.anchor.setTo(0.5, 0.5);
    
            var restartLabel = game.add.text(game.width/2, 420, 
                '按"上"鍵回到標題頁面...', {font: '20px 微軟正黑體', fill: '#000000'});
            restartLabel.anchor.setTo(0.5, 0.5);
            this.player.died=true;
        }
        var upKey= game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.restart,this);
        
    },

    restart: function(){
        var str = prompt('請輸入暱稱:D');
        if (str != null) {

            firebase.database().ref('scores').push().set({
                name: str,
                score: this.score
            });

            alert('已記錄分數\n' + str + " : " + this.score);         
        }
        if(this.score > game.global.score) game.global.score = this.score;
        game.state.start('menu');
    },

    movePlayer: function() {
        if(this.player.died){
            this.player.frame = 7;
            
        }
        else if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -210;
            this.player.facingLeft = true;

            this.player.animations.play('leftwalk');
        }
        else if (this.cursor.right.isDown) { 
            this.player.body.velocity.x = 210;
            this.player.facingLeft = false;

            this.player.animations.play('rightwalk');
        }    
        // If neither the right or left arrow key is pressed
        else {
            // Stop the player 
            this.player.body.velocity.x = 0;
        
            if(this.player.facingLeft) {
                this.player.frame = 5;
            }else {
                this.player.frame = 2;
            }
            // Stop the animation
            this.player.animations.stop();
        }    
    }
};




