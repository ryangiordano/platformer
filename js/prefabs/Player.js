var Platformer = Platformer || {};

Platformer.Player = function(game_state, position, properties) {
    "use strict";

    Platformer.Prefab.call(this, game_state, position, properties);
    this.walking_speed = +properties.walking_speed;
    this.enemyDie = this.game.add.audio('enemyDie');
    this.swipe_sound = this.game.add.audio("swipe_sound");

    this.jump = this.game.add.audio('jump');
    this.hurt = this.game.add.audio('hurt');
    this.jumping_speed = +properties.jumping_speed;
    this.bouncing = +properties.bouncing;
    this.score = +localStorage.player_score || 0;
    this.lives = +localStorage.player_lives || +properties.lives;
    this.hearts = +localStorage.player_hearts || +properties.hearts;
    this.attack_rate = +properties.attack_rate;
    this.attack_speed = +properties.attack_speed;



    this.knockback = false;
    this.distance = 75;
    this.knockedTo = 0;

    this.game_state.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.width=72;
    this.body.offset.x=36;
    this.body.tilePadding.x = 10;

    this.direction = "RIGHT";

    this.animations.add("standing", [0, 1, 2, 3, 4], 12, true);
    this.animations.add("jumping", [5], 12, true);
    this.animations.add("running", [6, 7, 8, 9, 10, 11, 12], 16, true);
    this.animations.add("gothit", [13, 14], 12, true);
    this.animations.add("swipe", [15,16,17,18,19,19,19,19,19], 30, false);
    this.anchor.setTo(0.5);
    this.cursors = this.game_state.game.input.keyboard.createCursorKeys();

    this.swipe_timer = this.game_state.game.time.create();
    this.swipe_timer.loop(Phaser.Timer.SECOND / this.attack_rate, this.swipe, this);
    this.swipe_animation_playing=false;

    console.log(this);


    this.jumpTimer = 0;

};

Platformer.Player.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Player.prototype.constructor = Platformer.Player;

Platformer.Player.prototype.update = function() {




    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    if (!this.invuln) {
        this.game_state.game.physics.arcade.collide(this, this.game_state.groups.enemies, this.hit_enemy, null, this);
    }
    //the player automatically dies if in contact with invincible enemies or enemy fireballs
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.invincible_enemies, this.die, null, this);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.enemy_fireballs, this.hit, null, this);

    if (!this.swipe_animation_playing.isPlaying && this.cursors.right.isDown && this.body.velocity.x >= 0) {
        //moving right now
        // this.body.velocity.x = this.walking_speed;
        this.body.velocity.x = 350;
        this.direction = "RIGHT";
        //this sets the sprite walking right
        this.animations.play("running");
        this.scale.setTo(1, 1);
    } else if (!this.swipe_animation_playing.isPlaying && this.cursors.left.isDown && this.body.velocity.x <= 0) {
        //move left
        // this.body.velocity.x = -this.walking_speed;
        this.body.velocity.x = -350;
        this.direction = "LEFT";
        this.animations.play("running");
        this.scale.setTo(-1, 1);
    } else if(!this.swipe_animation_playing.isPlaying){
        //stop

        this.body.velocity.x = 0;
        this.animations.play("standing");

    }
    //jump only if touching a  tile
    if (this.cursors.up.isDown && this.body.blocked.down) {
        this.body.velocity.y = -this.jumping_speed;
        this.jumpTimer = 1;
        this.jump.play();

    }
    if (this.knockback == true) {

        this.knockbackAnimation(this, this.hitLeft, this.hitRight);


    }
    //  else if (this.cursors.up.isDown && (this.jumpTimer !=0) )  {
    //       // player is no longer on the ground, but is still holding the jump key
    //       if(this.jumpTimer >30){
    //         //player has been holding jump for over 30 frames.  Stop counting
    //         this.jumpTimer= 0;
    //       }else{
    //         //player is allowed to jump higher-- this hasn't reached 30 frames yet
    //         this.jumpTimer++;
    //         this.body.velocity.y = -this.jumping_speed;
    //       }
    // }else if(this.jumpTimer != 0) {
    //       // reset jumptimer since the key is no longer being held
    //       this.jumpTimer =0;  }
    if (!this.body.blocked.down && !this.knockback && !this.swipe_animation_playing.isPlaying) {
        this.animations.play("jumping");
    }

    //dies if touching the end of the screen
    if (this.bottom >= this.game_state.game.world.height) {
        this.game_state.restart_level();
    }
    if (this.game_state.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        if (!this.swipe_timer.running) {

            this.swipe();

            console.log(this.activeSwipe.x)
            this.swipe_timer.start();
        }
    } else {
        this.swipe_timer.stop(false);
    }
    if(this.swipe_timer.running){
      if(this.direction == "RIGHT"){
        this.activeSwipe.x = this.x+50;
        this.activeSwipe.y = this.y
      }else{
      this.activeSwipe.x = this.x-50;
      this.activeSwipe.y = this.y;
      }
    };
};
Platformer.Player.prototype.knockbackAnimation = function(player, left, right) {
    this.animations.play("gothit", 12, true);
    player.body.sprite.alpha = 0.5;
    this.invuln = true;
    if (this.knockedTo == 0) {
        this.hurt.play();
        this.knockedTo = (right) ? (player.body.x + this.distance) : (player.body.x - this.distance); //going forwards, so adding this.distance
    }
    player.body.velocity.x = right ? 500 : -500;
    if (right) {
        if (player.body.x >= (this.knockedTo + this.distance / 2)) {
            player.body.velocity.y = 100;
        } else {
            player.body.velocity.y = -100;
        }
        if (player.body.x >= this.knockedTo) {
            this.knockedTo = 0;
            this.knockback = false;
            this.game.time.events.add(2000, function() {

                player.body.sprite.alpha = 1;
                this.hitLeft = false;
                this.hitRight = false;
                this.invuln = false;
            }, this);
        }
    } else {
        if (player.body.x <= (this.knockedTo + this.distance / 2)) {
            player.body.velocity.y = 100;
        } else {
            player.body.velocity.y = -100;
        }
        if (player.body.x <= this.knockedTo) {
            this.knockedTo = 0;
            this.knockback = false;
            this.game.time.events.add(2000, function() {
                player.body.sprite.alpha = 1;

                this.hitLeft = false;
                this.hitRight = false;
                this.invuln = false;
            }, this);

        }
    }

}

Platformer.Player.prototype.hit_enemy = function(player, enemy) {
    "use strict";
    if (enemy.body.touching.up) {
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
        //hop off an enemy's head
        player.body.velocity.y = -this.jumping_speed;
    } else {

        if (enemy.body.touching.left) {
            this.hitLeft = true;
            this.hitRight = false;
            this.knockback = true;
        } else if (enemy.body.touching.right) {
            this.hitRight = true;
            this.hitLeft = false;
            this.knockback = true;

        }
        this.hit();
    }
};

Platformer.Player.prototype.hit = function() {
    "use strict";
    this.hearts -= 1;
    this.shooting = false;
    if (this.hearts <= 0) {
        this.die();
    }
}
Platformer.Player.prototype.die = function() {
    "use strict";
    this.lives -= 1;
    this.shooting = false;
    if (this.lives > 0) {
        this.game_state.restart_level();
    } else {
        this.game_state.game_over();
    }
};

Platformer.Player.prototype.shoot = function() {
    "use strict";
    var fireball, fireball_position, fireball_properties;
    //get first dead fireball from the pool
    fireball = this.game_state.groups.fireballs.getFirstDead();
    fireball_position = new Phaser.Point(this.x, this.y);
    if (!fireball) {
        //if there is no dead fireball, create a new one
        fireball_properties = {
            "texture": "fireball_image",
            "group": "fireballs",
            "direction": this.direction,
            "speed": this.attack_speed
        };
        fireball = new Platformer.Fireball(this.game_state, fireball_position, fireball_properties);
        console.log("a fireball is born");
    } else {
        //if there is a dead fireball, reset it in the new position
        fireball.reset(fireball_position.x, fireball_position.y);
        fireball.body.velocity.x = (this.direction == "LEFT") ? -this.attack_speed : this.attack_speed;
    }
};

Platformer.Player.prototype.swipe = function() {
    "use strict";
    this.swipe_sound.play();
    this.swipe_animation_playing = this.animations.play("swipe");
    this.activeSwipe;
    var swipe_position, swipe_properties;
    //get first dead swipe from the pool

    swipe_position = this.direction == "RIGHT" ? new Phaser.Point(this.x+50, this.y+5) : new Phaser.Point(this.x-50, this.y+5);
        swipe_properties = {
            "texture": "swipe_image",
            "group": "swipe",
            "direction": this.direction,
            "speed": this.attack_speed
        };
        this.activeSwipe = new Platformer.Swipe(this.game_state, swipe_position, swipe_properties);
};
