var Platformer = Platformer || {};

Platformer.Platform = function(game_state, position, properties){
  "use strict";
  Platformer.Prefab.call(this, game_state, position, properties);

  this.game_state.game.physics.arcade.enable(this);
  this.body.immoveable = true;
  this.body.allowGravity = false;
  this.anchor.setTo(0.5);
};

Platformer.Platform.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Platform.prototype.constructor = Platformer.Platform;
Platformer.Platform.prototype.update = function(){
  "use strict";

  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
  this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.logMe,null, this);
};
Platformer.Platform.prototype.logMe = function(){
  console.log('log me');
}
