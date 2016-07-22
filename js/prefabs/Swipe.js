var Platformer = Platformer || {};

Platformer.Swipe = function (game_state, position, properties) {
    "use strict";
    Platformer.Prefab.call(this, game_state, position, properties);

    this.direction = properties.direction;
    this.speed = +properties.speed;
    this.animations.add("swipe_image1",[6,6,6,6,6,1,2,3,4,5,6,7,8,9,6],60, false);
    this.animations.add("swipe_image",[10,11,12,13,14,15,16,17,18,19,20],30,false);
    this.animations.play('swipe_image1');
    this.game_state.game.physics.arcade.enable(this);
    this.body.allowGravity = false;
    // this.body.immovable = true;

    // velocity is constant, but defined by direction
    if (this.direction == "LEFT") {

        this.scale.setTo(-1,1);
    } else {

    }
    var thisSwipe = this;
    this.game.time.events.add(500,function(){
      thisSwipe.kill();
    })
    this.anchor.setTo(0.5);
};

Platformer.Swipe.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Swipe.prototype.constructor = Platformer.Swipe;

Platformer.Swipe.prototype.update = function () {
    "use strict";
  };
