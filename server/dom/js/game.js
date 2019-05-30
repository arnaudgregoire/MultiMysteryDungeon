const players = {};
 
const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  autoFocus: false
};
 
function preload() {
  this.load.image('tiles','../../assets/test_tileset.png');
  this.load.tilemapTiledJSON('map','../../assets/test_map.json');
  this.load.multiatlas('sprites','../../assets/test_sprites.json');
}
 
function create() {
  const self = this;
  this.players = this.physics.add.group();
  this.map = this.make.tilemap({key:'map'});
  const tileset = this.map.addTilesetImage('test_tileset', 'tiles');
  const worldLayer = this.map.createStaticLayer('world', tileset, 0, 0);    
  worldLayer.setCollisionByProperty({ collides: true });
  this.physics.add.collider(this.players, worldLayer);
  
  const spawnPoint = this.map.findObject("Objects", obj => obj.name === "spawn_point");

  io.on('connection', function (socket) {
    
    console.log('a user connected');
    // create a new player and add it to our players object
    players[socket.id] = {
      x: spawnPoint.x,
      y: spawnPoint.y,
      playerId: socket.id,
      input: {
        left: false,
        right: false,
        up: false,
        down: false
      },
      sprite: 'left'
    };
    // add player to server
    addPlayer(self, players[socket.id]);
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);
 
    socket.on('disconnect', function () {
      console.log('user disconnected');
      // remove player from server
      removePlayer(self, socket.id);
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerInput', function (inputData) {
      handlePlayerInput(self, socket.id, inputData);
    });
  });
}
 
function update() {
  this.players.getChildren().forEach((player) => {
    player.setVelocity(0);
    const input = players[player.playerId].input;
    if (input.left) {
      player.setVelocityX(-80);
      players[player.playerId].sprite = 'left';
    } 
    if (input.right) {
      player.setVelocityX(80);
      players[player.playerId].sprite = 'right';
    } 
    if (input.down) {
      player.setVelocityY(80);
      players[player.playerId].sprite = 'down';
    }
    if (input.up) {
      player.setVelocityY(-80);
      players[player.playerId].sprite = 'up';
    }
  
    players[player.playerId].x = player.x;
    players[player.playerId].y = player.y;
  });
  //this.physics.world.wrap(this.players, 5);
  io.emit('playerUpdates', players);
}

function handlePlayerInput(self, playerId, input) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].input = input;
    }
  });

  
}

function addPlayer(self, playerInfo) {
  const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'sprites','sprite1').setOrigin(0.5, 0.5);
  player.playerId = playerInfo.playerId;
  self.players.add(player);
}
 
function removePlayer(self, playerId) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      player.destroy();
    }
  });
}
 
const game = new Phaser.Game(config);
window.gameLoaded();