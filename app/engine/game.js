const Player = require("../model/type/player");

class Game {
  constructor(config) {
    this.width = config.width;
    this.height = config.height;
    this.tilesize = config.tilesize;
    this.players = [];
  }

  computePositions() {
    // down, downleft, left, upleft, up, upright, right, downright
    this.players.forEach(player => {
      player.x = player.x + player.moveAlongX * this.tilesize;
      player.y = player.y + player.moveAlongY * this.tilesize;
    });
  }


  getPlayerById(id) {
    let found = false;
    let foundPlayer;
    this.players.forEach(player => {
      if (player.id == id) {
        found = true;
        foundPlayer = player;
      }
    });
    if (found) {
      return foundPlayer;
    }
    else {
      return new Error("no player for given id ( " + id +" ) found");
    }
  }

  /**
  * Check if the player is in the game
  * @param {string} id The identifiant of the player
  */
  isPlayer(id) {
    // let is = false;
    // this.players.forEach(player => {
    //   if (player.id == id) { is=true };
    // });
    // return is;
    return this.players.filter(p => p.id === id).length > 0;
  }

  /**
  * add given player to game.players
  * @param {Player} player
  */
  addPlayer(player) {
    this.players.push(player);
  }
}

module.exports = Game;
