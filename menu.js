var menuState = {
    create: function(){
        game.add.image(0, 0, 'background'); 


        this.labels = game.add.group();
        // Game title
        game.add.text(game.width/2, 80, ' 下樓梯！', {font: '120px 微軟正黑體', fill: '#ffffff'}, this.labels);
        // Show score
        game.add.text(game.width/2, 200, 
            '你的最高分 : '+ game.global.score, {font: '25px 微軟正黑體', fill: '#000000'}, this.labels);
        // Leaderboard
        game.add.text(game.width/2, 260, '排行榜', {font: '25px 微軟正黑體', fill: '#000000'}, this.labels);

        //this.scores = game.add.group();
        this.scores = game.add.group();

        var first = game.add.text(150, 310, '#1', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var second = game.add.text(150, 340, '#2', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var third = game.add.text(150, 370, '#3', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var fourth = game.add.text(150, 400, '#4', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var fifth = game.add.text(150, 430, '#5', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);

        var first_name = game.add.text(240, 310, '--', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var second_name = game.add.text(240, 340, '--', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var third_name = game.add.text(240, 370, '--', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var fourth_name = game.add.text(240, 400, '--', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var fifth_name = game.add.text(240, 430, '--', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);

        var first_score = game.add.text(330, 310, '--', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var second_score = game.add.text(330, 340, '--', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var third_score = game.add.text(330, 370, '--', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var fourth_score = game.add.text(330, 400, '--', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);
        var fifth_score = game.add.text(330, 430, '--', {font: '22px 微軟正黑體', fill: '#000000'}, this.scores);

        var i = 0;
        // firebase
        firebase.database().ref('scores').orderByChild('score').limitToLast(5).once('value').
        then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var name = childSnapshot.val().name;
                var score = childSnapshot.val().score;
                var text = '#' + i + 1 + ' ' + name + ' ' + score;

                if(i==0){
                    fifth_name.text = name; fifth_score.text = score;
                } 
                if(i==1){
                    fourth_name.text = name; fourth_score.text = score;
                } 
                if(i==2){
                    third_name.text = name; third_score.text = score;
                } 
                if(i==3){
                    second_name.text = name; second_score.text = score;
                } 
                if(i==4){
                    first_name.text = name; first_score.text = score;
                }
                //this.scores.getChildAt(i).text = '#' + i + ' ' + name + ' ' + score;
                i++;
            })
        });




        // How to start
        game.add.text(game.width/2, 560, 
            '按"上"鍵開始...', {font: '25px 微軟正黑體', fill: '#000000'}, this.labels);



        this.labels.setAll('anchor.x', 0.5 );
        this.labels.setAll('anchor.y', 0.5 );
        this.scores.setAll('anchor.x', 0 );
        this.scores.setAll('anchor.y', 0.5 );
/*
        
        var nameLabel = game.add.text(game.width/2, 80, ' 下樓梯！', {font: '120px 微軟正黑體', fill: '#ffffff'});
        nameLabel.anchor.setTo(0.5, 0.5);

        // Leaderboard
        var scoreLabel = game.add.text(game.width/2, 200, '排行榜', {font: '25px 微軟正黑體', fill: '#000000'});
        scoreLabel.anchor.setTo(0.5, 0.5);


        // Show score
        var scoreLabel = game.add.text(game.width/2, 250, 
            '你的最高分 : '+ game.global.score, {font: '25px 微軟正黑體', fill: '#000000'});
        scoreLabel.anchor.setTo(0.5, 0.5);

        // How to start
        var startLabel = game.add.text(game.width/2, 560, 
            '按"上"鍵開始...', {font: '25px 微軟正黑體', fill: '#000000'});
        startLabel.anchor.setTo(0.5, 0.5);
*/

        // Start
        var upKey= game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.start,this);
       
        
    },
    start: function(){
        game.state.start('play');
    },
};

