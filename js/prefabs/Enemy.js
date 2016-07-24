var Platformer = Platformer || {};

Platformer.Enemy = function(game_state, position, properties){
  "use strict";
  Platformer.Prefab.call(this, game_state, position, properties);
  this.walking_speed = +properties.walking_speed;
    this.enemyDie = this.game.add.audio('enemyDie');
  this.walking_distance = +properties.walking_distance;
  this.score = +properties.score;
  this.life = +properties.life;
  //saving previous x to keep track of walked distance
  this.previous_x =this.x;

  this.game_state.game.physics.arcade.enable(this);
  this.body.velocity.x = properties.direction * this.walking_speed;
  this.body.immovable = true;
  this.scale.setTo(properties.direction,1);
  this.anchor.setTo(0.5);
};
Platformer.Enemy.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Enemy.prototype.constructor = Platformer.Enemy;

Platformer.Enemy.prototype.update = function(){
  "use strict";
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.fireballs, this.getShot, null, this);
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.swipe, this.getSwiped, null, this);

  //change the direction if walked the maximum distance
  if(Math.abs(this.x-this.previous_x) >= this.walking_distance){
    this.switch_direction();
  }
};
Platformer.Enemy.prototype.switch_direction = function(){
  "use strict";
  this.body.velocity.x *= -1;
  this.previous_x = this.x;
  this.scale.setTo(-this.scale.x, 1);
}

Platformer.Enemy.prototype.getShot = function(enemy, fireball){
  this.score += enemy.score;
  var emitter = this.game.add.emitter(enemy.x, enemy.y, 100);
  emitter.makeParticles('enemy_die_sparkle');
  emitter.minParticleSpeed.setTo(-200, -200);
  emitter.maxParticleSpeed.setTo(100, 100);
  emitter.gravity = -1000;
  emitter.start(true, 700, null, 20);
  //enable particle animation of all particles
  emitter.forEach(function(singleParticle) {
      singleParticle.animations.add('enemy_die_sparkle');
      singleParticle.animations.play('enemy_die_sparkle', 12, false);
  });
  this.enemyDie.play();
  enemy.kill();
  fireball.kill();
}

Platformer.Enemy.prototype.getSwiped = function(enemy, swipe){
  this.score += enemy.score;
  this.life -=1;
  this.invuln=true;
  this.body.alpha = 0.5;
  var emitter = this.game.add.emitter(enemy.x, enemy.y, 100);
  emitter.makeParticles('enemy_die_sparkle');
  emitter.minParticleSpeed.setTo(-200, -200);
  emitter.maxParticleSpeed.setTo(100, 100);
  emitter.gravity = -1000;
  emitter.start(true, 700, null, 20);
  //enable particle animation of all particles
  emitter.forEach(function(singleParticle) {
      singleParticle.animations.add('enemy_die_sparkle');
      singleParticle.animations.play('enemy_die_sparkle', 12, false);
  });
  this.enemyDie.play();
  if(this.life <=0){
      enemy.kill();
  }


}
