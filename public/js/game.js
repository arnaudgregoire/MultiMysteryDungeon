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
      if (players[id].playerId === self.socket.id) {
        displayPlayers(self, players[id], 'ship');
      } else {
        displayPlayers(self, players[id], 'otherPlayer');
      }
    });
  });
 
  this.socket.on('newPlayer', function (playerInfo) {
    displayPlayers(self, playerInfo, 'otherPlayer');
  });
 
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
          player.setRotation(players[id].rotation);
          player.setPosition(players[id].x, players[id].y);
        }
      });
    });
  });

  this.cursors = this.input.keyboard.createCursorKeys();
  this.leftKeyPressed = false;
  this.rightKeyPressed = false;
  this.upKeyPressed = false;
}
 
function update() {

  const left = this.leftKeyPressed;
  const right = this.rightKeyPressed;
  const up = this.upKeyPressed;
  
  if (this.cursors.left.isDown) {
    this.leftKeyPressed = true;
  } else if (this.cursors.right.isDown) {
    this.rightKeyPressed = true;
  } else {
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
  }
  
  if (this.cursors.up.isDown) {
    this.upKeyPressed = true;
  } else {
    this.upKeyPressed = false;
  }
  
  if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed) {
    this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
  }
}


function displayPlayers(self, playerInfo, sprite) {
  const player = self.add.sprite(playerInfo.x, playerInfo.y, 'sprites', 'sprite1').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  player.anims.play('test');
  player.playerId = playerInfo.playerId;
  self.players.add(player);
}

function createAnimations(self) {
  //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
  let frameNames = self.anims.generateFrameNames('sprites', {
      start:1,
      end:8,
      prefix:'sprite'
    });

  self.anims.create({ key: 'test', frames: frameNames, frameRate: 10, repeat: -1 });

}
 