var Platformer = Platformer || {};

Platformer.Player = function(game_state, position, properties){
  "use strict";

  Platformer.Prefab.call(this, game_state, position, properties);
  this.walking_speed = +properties.walking_speed;
    this.enemyDie = this.game.add.audio('enemyDie');
    this.jump = this.game.add.audio('jump');
  this.jumping_speed = +properties.jumping_speed;
  this.bouncing = +properties.bouncing;
  this.score = +localStorage.player_score || 0;
  this.lives = +localStorage.player_lives || +properties.lives;
  this.attack_rate = +properties.attack_rate;
  this.attack_speed = +properties.attack_speed;
  this.shooting = false;

  this.game_state.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;

  this.direction ="RIGHT";

  this.animations.add("standing",[0,1,2,3,4], 12, true);
  this.animations.add("jumping",[5],12,true);
  this.animations.add("running",[6,7,8,9,10,11,12],16,true);

  this.anchor.setTo(0.5);
  this.cursors = this.game_state.game.input.keyboard.createCursorKeys();

  this.shoot_timer = this.game_state.game.time.create();
  this.shoot_timer.loop(Phaser.Timer.SECOND/this.attack_rate, this.shoot, this);
};

Platformer.Player.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Player.prototype.constructor = Platformer.Player;

Platformer.Player.prototype.update = function () {
  "use strict";
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
  this.game_state.game.physics.arcade.collide(this,this.game_state.groups.enemies,this.hit_enemy, null, this);
  //the player automatically dies if in contact with invincible enemies or enemy fireballs
  this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.incincible_enemies, this.die, null, this);
  this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.enemy_fireballs, this.die, null, this);

  if(this.cursors.right.isDown && this.body.velocity.x >= 0){
    //moving right now
    // this.body.velocity.x = this.walking_speed;
    this.body.velocity.x = 350;
    this.direction = "RIGHT";
    //this sets the sprite walking right
    this.animations.play("running");
    this.scale.setTo(1,1);
  }else if(this.cursors.left.isDown && this.body.velocity.x <= 0){
    //move left
    // this.body.velocity.x = -this.walking_speed;
    this.body.velocity.x = -350;
    this.animations.play("running");
    this.scale.setTo(-1,1);
  }else{
    //stop
    this.body.velocity.x = 0;
    this.animations.stop();
    this.animations.play("standing");
  }
  //jump only if touching a  tile
  if(this.cursors.up.isDown && this.body.blocked.down){
    this.body.velocity.y = -this.jumping_speed;
              this.jump.play();
  }
  if(!this.body.blocked.down){
        this.animations.play("jumping");
  }

  //dies if touching the end of the screen
  if(this.bottom >= this.game_state.game.world.height){
    this.game_state.restart_level();
  }
};

Platformer.Player.prototype.hit_enemy = function(player, enemy){
  "use strict";
  if(enemy.body.touching.up){
    this.score += enemy.score;
    var emitter = this.game.add.emitter(enemy.x, enemy.y, 100);
    emitter.makeParticles('enemy_die_sparkle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(100, 100);
    emitter.gravity = -1000;

    emitter.start(true, 700, null, 25);
     //enable particle animation of all particles
     emitter.forEach(function(singleParticle) {    singleParticle.animations.add('enemy_die_sparkle');    singleParticle.animations.play('enemy_die_sparkle', 12, true);
      });
      this.enemyDie.play();
    enemy.kill();
    //hop off an enemy's head
    player.body.velocity.y = -this.jumping_speed;
  }else{
    this.game_state.restart_level();
  }
};
Platformer.Player.prototype.die = function(){
  "use strict";
  this.lives -=1;
  this.shooting = false;
  if(this.lives > 0){
    this.game.state.restart_level();
  }else{
    this.game_state.game_over();
  }
};

Platformer.Player.prototype.shoot = function(){
  "use strict";
  var fireball, fireball_position, fireball_properties;
  //get first dead fireball from the pool
  fireball = this.game_state.groups.fireballs.getFirstDead();
  fireball_position = new Phaser.Point(this.x, this.y);
  if (!fireball){
    //if there is no dead fireball, create a new one
    fireball_properties = {"texture": "fireball_image", "group":"fireballs", "direction": this.direction, "speed":this.attack_speed};
    fireball = new Platformer.Fireball(this.game_state, fireball_position, fireball_properties);
  }else{
    //if there is a dead fireball, reset it in the new position
    fireball.reset(fireball_position.x, fireball_position.y);
    fireball.body.velocity.x = (this.direction =="LEFT") ? -this.attack_speed : this.attack_speed;
  }
};
