var Platformer = Platformer || {};

Platformer.Checkpoint = function(game_state, position, properties){
  "use strict";
  Platformer.Prefab.call(this, game_state, position, properties);

  this.checkpoint_reached = false;

  this.game_state.game.physics.arcade.enable(this);
  this.frame = 0;
  this.anchor.setTo(0.5);
  this.animations.add('open',[0,1,2,3,4,5,6,5,6,5,6,7,6,7,6,7],12,false);
  this.savepointSound = this.game.add.audio('savepoint_sound');
  var style = {font:"32px Arial", fill:"#000000"};
  this.message = game.add.text(0,0,"保存点达到！",style);
  this.message.anchor.set(0.5);
};

Platformer.Checkpoint.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Checkpoint.prototype.constructor = Platformer.Checkpoint;

Platformer.Checkpoint.prototype.update = function(){
  "use strict";
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
  //when the player reaches the checkpoint, it calls the reach_checkpoint method, setting it to true;
  if(!this.checkpoint_reached){
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.reach_checkpoint, null, this);
  }
};

Platformer.Checkpoint.prototype.reach_checkpoint = function(){
  "use strict";

  //checkpoint reached
  this.animations.play('open');
  var emitter = this.game.add.emitter(this.x, this.y, 100);
  emitter.makeParticles('save_sparkle');
  emitter.minParticleSpeed.setTo(-200, -200);
  emitter.maxParticleSpeed.setTo(100, 100);
  emitter.gravity = -1000;
   this.savepointSound.play();
  emitter.start(true, 600, null, 30);
   //enable particle animation of all particles
   emitter.forEach(function(singleParticle) {    singleParticle.animations.add('save_sparkle');    singleParticle.animations.play('save_sparkle', 12, false);

 });
this.message.x = Math.floor(this.x);
this.message.alpha = 0;
 this.message.y = Math.floor(this.y);
this.game.time.events.add(0,function(){
  this.game.add.tween(this.message).to({y:this.message.y-40,alpha:1},500,Phaser.Easing.Linear.None, true);
},this);


 this.game.time.events.add(2000,function(){
   this.game.add.tween(this.message).to({y:0},5000,Phaser.Easing.Linear.None, true);
  this.game.add.tween(this.message).to({alpha:0},500,Phaser.Easing.Linear.None, true);},this);

  this.checkpoint_reached = true;

}
