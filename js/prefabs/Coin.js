var Platformer = Platformer || {};

Platformer.Coin = function(game_state, position, properties) {
    "use strict";
    Platformer.Prefab.call(this, game_state, position, properties);

    this.score = +properties.score;
    this.getBerry = this.game.add.audio('getBerry');
    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.anchor.setTo(0.5);
    this.animations.add("berry");
    this.animations.play("berry", 12, true);

    this.emitter = this.game.add.emitter(0,0, 10);
};

Platformer.Coin.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Coin.prototype.constructor = Platformer.Coin;

Platformer.Coin.prototype.update = function() {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players,this.collect_coin, null, this);
};

Platformer.Coin.prototype.collect_coin = function(coin, player) {
    "use strict";
    //  this.game.add.emitter(this.x, this.y, 100);
    this.emitter.emitX = this.x;
    this.emitter.emitY = this.y;
    this.emitter.makeParticles('berry_sparkle');
    this.emitter.minParticleSpeed.setTo(-200, -200);
    this.emitter.maxParticleSpeed.setTo(100, 100);
    this.emitter.gravity = -700;

    this.emitter.start(true, 1000, null, 10);

    //enable particle animation of all particles
    this.emitter.forEach(function(singleParticle) {
        singleParticle.animations.add('berry_sparkle');
        singleParticle.animations.play('berry_sparkle', 30, false);
    });




    // this.bombEmitter.length === 0 && this.bombEmitter.push(this.game.add.emitter(0, 0, 30));
    // var bombEmitter = this.bombEmitter[0] bombEmitter.kill();
    // bombEmitter.gravity = 0;
    // bombEmitter.setXSpeed(-200, 200);
    // bombEmitter.setYSpeed(-200, 200); // make smoke drift upwards
    // bombEmitter.setAlpha(1, 0, 1000, Phaser.Easing.Linear.InOut);bombEmitter.makeParticles('star');//add to the ground group so it will following during scroll
    // ground.addChild( bombEmitter)bombEmitter.start(true, 1000, 50, 15);






    this.getBerry.play();
    //kill the coin and increase the score
    this.kill();
    player.score += this.score;

}
