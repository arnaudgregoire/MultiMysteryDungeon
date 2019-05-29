var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
 
var game = new Phaser.Game(config);
 
function preload() {
  this.load.image('ship', 'assets/spaceShips_001.png');
  this.load.image('otherPlayer', 'assets/enemyBlack5.png');
  this.load.image('tiles','assets/test_tileset.png');
  this.load.tilemapTiledJSON('map','assets/test_map.json');
  this.load.multiatlas('sprites','assets/test_sprites.json');
}
 
function create() {
  var self = this;
  this.socket = io();
  this.players = this.add.group();
  createAnimations(self);

  const map = this.make.tilemap({key:'map'});
  const tileset = map.addTilesetImage('test_tileset', 'tiles');
  
  const layer = map.createStaticLayer('world', tileset, 0, 0);    
 
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      displayPlayers(self, players[id]);
    });
  });
 
  this.socket.on('newPlayer', function (playerInfo) {
    displayPlayers(self, playerInfo);
  });
 
  /*
  When the  disconnect event is fired, we take that player’s id and we remove that player’s ship from the game.
  We do this by calling the  getChildren() method on our  players group.
  The  getChildren() method will return an array of all the game objects that are in that group,
  and from there we use the  forEach() method to loop through that array.
  */
  this.socket.on('disconnect', function (playerId) {
    self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  });

  this.socket.on('playerUpdates', function (players) {
    Object.keys(players).forEach(function (id) {
      self.players.getChildren().forEach(function (player) {
        if (players[id].playerId === player.playerId) {
          player.setPosition(players[id].x, players[id].y);
        }
      });
    });
  });

  this.cursors = this.input.keyboard.createCursorKeys();
  this.leftKeyPressed = false;
  this.rightKeyPressed = false;
  this.upKeyPressed = false;
  this.downKeyPressed = false;
}
 
function update() {

  const left = this.leftKeyPressed;
  const right = this.rightKeyPressed;
  const up = this.upKeyPressed;
  const down = this.downKeyPressed;
  
  // Horizontal movement
  if (this.cursors.left.isDown)
  {
      this.leftKeyPressed = true;
  }
  else{
      this.leftKeyPressed = false;
  }
  if (this.cursors.right.isDown)
  {
      this.rightKeyPressed = true;
  }
  else{
     this.rightKeyPressed = false;
  }

  // Vertical movement
  if (this.cursors.up.isDown)
  {
      this.upKeyPressed = true;
  }
  else{
     this.upKeyPressed = false;
  }
  if (this.cursors.down.isDown)
  {
      this.downKeyPressed = true;
  }
  else{
      this.downKeyPressed = false;
  }  
  
  if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed || down != this.downKeyPressed) {
    this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed, down: this.downKeyPressed });
  }
}


function displayPlayers(self, playerInfo) {
  console.log(playerInfo);
  const player = self.add.sprite(playerInfo.x, playerInfo.y, 'sprites', 'sprite1');
  player.anims.play(playerInfo.sprite);
  player.playerId = playerInfo.playerId;
  self.players.add(player);
}

function createAnimations(self) {
  //  animation with key 'left'
  self.anims.create({
     key: 'left',
    frames:  self.anims.generateFrameNames('sprites', {frames: [21,12,7], prefix:'sprite'}),
    frameRate: 4,
    repeat: -1 
  });

  self.anims.create({
    key: 'idleleft',
   frames:  self.anims.generateFrameNames('sprites', {frames: [21,7], prefix:'sprite'}),
   frameRate: 4,
   repeat: -1 
 });
  
  //  animation with key 'right'
  self.anims.create({
    key: 'right',
    frames:  self.anims.generateFrameNames('sprites', {frames: [21,12,7], prefix:'sprite'}),
    frameRate: 4,
    repeat: -1 
  });

  //  animation with key 'up'
  self.anims.create({
    key: 'up',
    frames:  self.anims.generateFrameNames('sprites', {frames: [14,26,4], prefix:'sprite'}),
    frameRate: 4,
    repeat: -1 
  });

  //  animation with key 'down'
  self.anims.create({
    key: 'down',
    frames:  self.anims.generateFrameNames('sprites', {frames: [5,1,6], prefix:'sprite'}),
    frameRate: 4,
    repeat: -1 
  });
}
 