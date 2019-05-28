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
  this.load.image('ship', '../public/assets/spaceShips_001.png');
}
 
function create() {
  const self = this;
  this.players = this.physics.add.group();
 
  io.on('connection', function (socket) {
    
    console.log('a user connected');
    // create a new player and add it to our players object
    players[socket.id] = {
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
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
  this.physics.world.wrap(this.players, 5);
  io.emit('playerUpdates', players);
}

function handlePlayerInput(self, playerId, input) {
  console.log(input);
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].input = input;
    }
  });

  
}

function addPlayer(self, playerInfo) {
  const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship');
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