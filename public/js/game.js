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
// https://phasertutorials.com/creating-a-simple-multiplayer-game-in-phaser-3-with-an-authoritative-server-part-2/
var game = new Phaser.Game(config);
 
function preload() {
  this.load.image('tiles','../../assets/test_tileset.png');
  this.load.tilemapTiledJSON('map','../../assets/test_map.json');
  this.load.multiatlas('sprites','../../assets/test_sprites.json');
}
 
function create() {
  var self = this;
  this.socket = io();
  // First, we created a new Phaser group which will be used to manage all of the player’s game objects on the client side.
  this.players = this.add.group();
  createAnimations(self);

  this.map = this.make.tilemap({key:'map'});
  const tileset = this.map.addTilesetImage('test_tileset', 'tiles');
  
  const layer = this.map.createStaticLayer('world', tileset, 0, 0);    
 
  // We used  socket.on to listen for the  currentPlayers event, and when this event is triggered,
  // the function we provided will be called with the  players object that we passed from our server.
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      //When this function is called,
      //we loop through each of the players and we check to see if that player’s id matches the current player’s socket id.
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
          //if the actual animation sprite currently played client side is different from the server one,
          // the client start to play and save the new sprite
          if(player.sprite != players[id].sprite){
            if(players[id].sprite == 'left'){
              player.flipX = false;
            }
            else{
              player.flipX = true;
            }
            player.sprite = players[id].sprite;
            player.anims.play(players[id].sprite);
          }
        }
      });
    });
  });

  /* 
  This will populate the cursors object with our four main Key objects (up, down, left, and right),
  which will bind to those arrows on the keyboard
  */
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
  if (this.cursors.left.isDown){this.leftKeyPressed = true}
  else{this.leftKeyPressed = false}

  if (this.cursors.right.isDown){this.rightKeyPressed = true}
  else{this.rightKeyPressed = false}

  // Vertical movement
  if (this.cursors.up.isDown){this.upKeyPressed = true}
  else{this.upKeyPressed = false}

  if (this.cursors.down.isDown){this.downKeyPressed = true}
  else{this.downKeyPressed = false}  
  
  if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed || down != this.downKeyPressed) {
    this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed, down: this.downKeyPressed });
  }
}

/*
Created our player by using the x and y coordinates that we generated in our server code.
We used  setOrigin() to set the origin of the game object to be in the middle of the object instead of the top left.
We stored the playerId so we can find the game object by that id later.
Lastly, we added the player’s game object to the Phaser group we created.
 */
function displayPlayers(self, playerInfo) {
  const player = self.add.sprite(playerInfo.x, playerInfo.y, 'sprites', 'sprite1').setOrigin(0.5, 0.5);
  player.anims.play(playerInfo.sprite);
  player.playerId = playerInfo.playerId;
  player.sprite = playerInfo.sprite;
  if(player.playerId == self.socket.id){
    //we set the camera on the player hero
    setCamera(self, self.map, player);
  }
  self.players.add(player);
}

function setCamera(self, map, hero){
    // Phaser supports multiple cameras, but you can access the default camera like this:
    console.log(hero);
    const camera = self.cameras.main;
    camera.startFollow(hero);
    camera.setBounds(0, 0, self.map.widthInPixels, self.map.heightInPixels);
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
 