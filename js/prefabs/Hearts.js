var Platformer = Platformer || {};

Platformer.Hearts = function(game_state, position, properties){
  "use strict";
  Platformer.Prefab.call(this, game_state, position, properties);
  this.frame = +properties.frame;
  // this.visible = false;
  this.spacing = +properties.spacing;

  this.fixedToCamera = true;
  //saving initial positioon if it gets changed by window scaling
  this.initial_position = new Phaser.Point(this.x, this.y);

  this.hearts = [];
  this.dead_heart = null;
  this.create_hearts();
  this.animations.add('beat',[0,1,2,1,0],12, true);
  this.animations.play('beat');

  this.emitter = this.game.add.emitter(0,0, 10);
};

Platformer.Hearts.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Hearts.prototype.constructor = Platformer.Hearts;

Platformer.Hearts.prototype.update = function(){
  "use strict";
  //update to show current number of hearts when there is a discrepency between the hearts on the player and the actual hearts array.
  if (this.game_state.prefabs.player.hearts !== this.hearts.length){
    this.update_hearts();

  }

};

Platformer.Hearts.prototype.create_hearts = function(){
  var heart_index, heart_position, heart;

  //create a sprite for each one of the player hearts
  for(heart_index = 0; heart_index < this.game_state.prefabs.player.hearts; heart_index +=1){

    heart_position = new Phaser.Point(this.initial_position.x + (heart_index * (this.width + this.spacing)), this.initial_position.y);
    heart = new Phaser.Sprite(this.game_state.game, heart_position.x, heart_position.y,this.texture);
    heart.fixedToCamera = true;
    this.game_state.groups.hud.add(heart);
    this.hearts.push(heart);
  }
  this.hearts.forEach(function(singleHeart) {
      singleHeart.animations.play('beat', 12, true);

  });
};

Platformer.Hearts.prototype.update_hearts = function(){
  "use strict";
  var heart, heart_position;

  heart = this.hearts[this.hearts.length -1];//because of zero index
  if(this.game_state.prefabs.player.hearts < this.hearts.length){
    //the player died, so we have to kill the last heart..
    heart.kill();
    this.dead_heart = heart;
    this.hearts.pop();
    var lastHeart = this.hearts.length -1;
    this.emitter.emitX = this.hearts[lastHeart].position.x;
    this.emitter.emitY = this.hearts[lastHeart].position.y;
    this.emitter.makeParticles('blooddrop');
    this.emitter.minParticleSpeed.setTo(-200, -200);
    this.emitter.maxParticleSpeed.setTo(100, 100);
    this.emitter.gravity = -700;

    this.emitter.start(true, 1000, null, 10);

    //enable particle animation of all particles
    this.emitter.forEach(function(singleParticle) {
        singleParticle.animations.add('blooddrop');
        singleParticle.animations.play('blooddrop', 12, false);
    });
  }else{
    //the player received another heart
    if(!this.dead_heart){
      //if there are no hearts missing that we can reuse, we create a new one
      heart_position = new Phaser.Point(this.initial_position.x + (this.hearts.length * (this.width + this.spacing)), this.initial_position.y);
      heart = new Phaser.Sprite(this.game_state.game, heart_position.x, heart_position.y, this.texture);
      heart.fixedToCamera = true;
      this.game_state.groups.hud.add(heart);

    }else{
      //if there is a missing heart, we just reset it
      heart = this.dead_heart;
      heart_position = new Phaser.Point(this.initial_position.x + ((this.hearts.length -1)* (this.width + this.spacing)), this.initial_position.y);
      heart.reset(heart_position.x, heart_position.y);
      this.dead_heart = null;
    }
    this.hearts.push(heart);
  }
};
