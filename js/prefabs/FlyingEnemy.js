var Platformer = Platformer || {};

Platformer.FlyingEnemy = function(game_state, position, properties){
  "use strict";
  Platformer.Enemy.call(this, game_state, position, properties);

  //flying enemies are not affected by gravity
  this.body.allowGravity = false;
  //name, frames, frameRate, loop? useNumbericIndex
  this.animations.add("flying",[0,1,2,3,4,5,6,5,4,3,2,1],20,true);
  this.animations.play("flying");
  this.scale.setTo(-this.scale.x, 1);
};
Platformer.FlyingEnemy.prototype = Object.create(Platformer.Enemy.prototype);
Platformer.FlyingEnemy.prototype.constructor = Platformer.FlyingEnemy;
