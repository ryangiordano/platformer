var Platformer = Platformer || {};

Platformer.Item = function(game_state, position, properties){
  "use strict";
Platformer.Prefab.call(this, game_state, position, properties);

this.game_state.game.physics.arcade.enable(this);
this.body.immovable = true;
this.body.allowGravity = false;

this.anchor.setTo(0.5);
};

Platformer.Item.prototype = Object.create(Platformer.Prefab.prototype);

Platformer.Item.prototype.constructor = Platformer.Item;

Platformer.Item.prototype.update = function(){
  "use strict";

  this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.collecti_item, null, this);
};

Platformer.Item.prototype.collect_item = function(){
  "use strict";
  //By default, the item is destroyed when collected
  this.kill();
}

//***Life increasing item***//
Platformer.LifeItem = function (game_state, position, properties) {
    "use strict";
    Platformer.Item.call(this, game_state, position, properties);
};

Platformer.LifeItem.prototype = Object.create(Platformer.Item.prototype);
Platformer.LifeItem.prototype.constructor = Platformer.LifeItem;

Platformer.LifeItem.prototype.collect_item = function (item, player) {
    "use strict";
    Platformer.Item.prototype.collect_item.call(this);
    player.lives += 1;
};

//***Power increasing Item ***//
Platformer.SilverMedal = function(game_state, position, properties){
  "use strict";
  Platformer.Item.call(this,game_state, position, properties);
  this.body.allowGravity = true;
  this.score = +properties.score;
  this.getMedal = this.game.add.audio('powerup');

  this.emitter = this.game.add.emitter(0,0, 10);
}
Platformer.SilverMedal.prototype = Object.create(Platformer.Item.prototype);
Platformer.SilverMedal.prototype.constructor = Platformer.SilverMedal;

Platformer.SilverMedal.prototype.collect_item = function(item, player){
  Platformer.Item.prototype.collect_item.call(this);
  this.getMedal.play();
  //  this.game.add.emitter(this.x, this.y, 100);
  this.emitter.emitX = this.x;
  this.emitter.emitY = this.y;
  this.emitter.makeParticles('save_sparkle');
  this.emitter.minParticleSpeed.setTo(-100, -100);
  this.emitter.maxParticleSpeed.setTo(50, 50);
  this.emitter.gravity = -1000;

  this.emitter.start(true, 500, null, 50);

  //enable particle animation of all particles
  this.emitter.forEach(function(singleParticle) {
      singleParticle.animations.add('berry_coin_sparkle');
      singleParticle.animations.play('berry_coin_sparkle', 30, false);
});
}
Platformer.SilverMedal.prototype.update = function(){
  "use strict";
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
  this.game_state.game.physics.arcade.overlap(this,this.game_state.groups.players, this.collect_item,null,this);
}

//*** Berry Coin ***//

Platformer.BerryCoin = function (game_state, position, properties) {
    "use strict";

    Platformer.Item.call(this, game_state, position, properties);
      this.berryCoin = this.game.add.audio('berrycoin');
      this.animations.add("berry_coin");
      this.animations.play("berry_coin", 12, true);
      this.score = +properties.score;

      this.emitter = this.game.add.emitter(0,0, 10);
};

Platformer.BerryCoin.prototype = Object.create(Platformer.Item.prototype);
Platformer.BerryCoin.prototype.constructor = Platformer.BerryCoin;

Platformer.BerryCoin.prototype.collect_item = function (item, player) {
    "use strict";
    Platformer.Item.prototype.collect_item.call(this);
    player.lives += 1;
    this.berryCoin.play();
    //  this.game.add.emitter(this.x, this.y, 100);
    this.emitter.emitX = this.x;
    this.emitter.emitY = this.y;
    this.emitter.makeParticles('save_sparkle');
    this.emitter.minParticleSpeed.setTo(-100, -100);
    this.emitter.maxParticleSpeed.setTo(50, 50);
    this.emitter.gravity = -1000;

    this.emitter.start(true, 500, null, 50);

    //enable particle animation of all particles
    this.emitter.forEach(function(singleParticle) {
        singleParticle.animations.add('save_sparkle');
        singleParticle.animations.play('save_sparkle', 30, false);
  });
};
Platformer.BerryCoin.prototype.update = function(){
  "use strict";
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
  this.game_state.game.physics.arcade.overlap(this,this.game_state.groups.players, this.collect_item,null,this);
}
