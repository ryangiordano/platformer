var Platformer = Platformer || {};

Platformer.Goal = function(game_state, position, properties){
  "use strict";
  Platformer.Prefab.call(this, game_state, position, properties);
  //properties comes from the tiled properties
  this.next_level = properties.next_level;

  this.game_state.game.physics.arcade.enable(this);

  this.anchor.setTo(0.5);
  var style = {font:"60px Arial", fill:"#000000"};
  this.happybirthday = game.add.text(0,0,"生日快乐！",style);
  this.happybirthday.anchor.set(0.5);
  this.frame = 0;
  this.animations.add('candles',[1,2,3,2,1],12,true);
  this.music = game_state.music;
};

Platformer.Goal.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Goal.prototype.constructor = Platformer.Goal;

Platformer.Goal.prototype.update= function(){
  "use strict";
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);

  if(!this.goal_reached){this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.reach_goal, null, this);
  }
};

Platformer.Goal.prototype.reach_goal = function(){
  "use strict";
  //start the next level
  // this.game_state.game.state.start("BootState", true, false, this.next_level);
  this.birthday = game.add.audio('goal');
  this.birthday.volume -=.6;
  this.birthday.loop = false;
    this.music.pause();
  this.birthday.play();

  this.animations.play('candles');
  var emitter = this.game.add.emitter(this.x, this.y, 100);
  emitter.makeParticles('berry_sparkle');
  emitter.minParticleSpeed.setTo(-200, -200);
  emitter.maxParticleSpeed.setTo(100, 100);
  emitter.gravity = -700;

  emitter.start(true, 1000, null, 10);
   //enable particle animation of all particles
   emitter.forEach(function(singleParticle) {    singleParticle.animations.add('berry_sparkle');    singleParticle.animations.play('berry_sparkle', 30, false);
    });
    this.happybirthday.x = Math.floor(this.x);
    this.happybirthday.alpha = 0;
     this.happybirthday.y = Math.floor(this.y);
    this.game.time.events.add(0,function(){
      this.game.add.tween(this.happybirthday).to({y:this.happybirthday.y-80,alpha:1},500,Phaser.Easing.Linear.None, true);
    },this);
    this.goal_reached=true;
};
