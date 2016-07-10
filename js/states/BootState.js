var Platformer = Platformer || {};

Platformer.BootState = function(){
  "use strict";
  Phaser.State.call(this);
}

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.BootState;
//loading the level file on initialization
Platformer.BootState.prototype.init = function(level_file){
  "use strict"
  //json level file gets churned into our object's scope on initialization
  this.level_file = level_file;
};

Platformer.BootState.prototype.preload = function(){
  "use strict";
  //load the json file into this.game.cache--->
  this.load.text("level1", this.level_file);
};

Platformer.BootState.prototype.create = function(){
  "use strict";
  var level_text, level_data;
  //take the level data from the cache and toss it into a variable: level_text
  level_text = this.game.cache.getText("level1");
  //parse level text
  level_data = JSON.parse(level_text);
  //send the parsed level text as level data to the next state where we can add assets to it
  this.game.state.start("LoadingState", true, false, level_data);
};
