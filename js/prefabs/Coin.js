var Platformer = Platformer || {};

Platformer.Coin = function(game_state, position, properties){
  "use strict";
  Platformer.Prefab.call(this, game_state, position, properties);

  this.score = +properties.score;
  this.getBerry = this.game.add.audio('getBerry');
  this.game_state.game.physics.arcade.enable(this);
  this.body.immovable = true;
  this.body.allowGravity = false;
  this.anchor.setTo(0.5);
  console.log(this);
  this.animations.add("berry");
  this.animations.play("berry",12,true);
};

Platformer.Coin.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Coin.prototype.constructor = Platformer.Coin;

Platformer.Coin.prototype.update = function(){
  "use strict";
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
  this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.collect_coin, null, this);
};

Platformer.Coin.prototype.collect_coin = function (coin, player){
  "use strict";
  var emitter = this.game.add.emitter(this.x, this.y, 100);
  emitter.makeParticles('berry_sparkle');
  emitter.minParticleSpeed.setTo(-200, -200);
  emitter.maxParticleSpeed.setTo(100, 100);
  emitter.gravity = -700;

  emitter.start(true, 1000, null, 10);
   //enable particle animation of all particles
   emitter.forEach(function(singleParticle) {    singleParticle.animations.add('berry_sparkle');    singleParticle.animations.play('berry_sparkle', 30, false);
    });

   this.getBerry.play();
  //kill the coin and increase the score
  this.kill();
  player.score += this.score;

}
