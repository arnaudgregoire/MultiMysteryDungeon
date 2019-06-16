const Player = require("../model/type/player");

class Game {
  constructor(config) {
    this.width = config.width;
    this.height = config.height;
    this.tilesize = config.tilesize;
    this.players = [];
    this.turn = 0;
  }

  setupNewTurn(){
    this.players.forEach(player =>{
      player.turnPlayed = false;
    })
    this.turn += 1;
    return this.turn;
  }

  computePositions() {
    // down, downleft, left, upleft, up, upright, right, downright
    this.players.forEach(player => {
      // if the player did not already played his turn
      if(!player.turnPlayed){
        // if the player really moved
        if(this.move(player)){
            // then his turn is played
            player.turnPlayed = true;
        }
      }
    });
  }
/**
 * check if all playe played their turn
 */
  checkEndTurn(){
    let endTurn = false;
    if(this.players.length != 0){
      endTurn = true;
      this.players.forEach(player =>{
        if(!player.turnPlayed){
          endTurn = false;
        }
      })
    }
    return endTurn;
  }
/**
 * Attempt to move the player in direction he want
 * @param {Player} player 
 */
  move(player){
    let playerMoved = false;
    if(player.moveAlongX != 0){
      player.x = player.x + player.moveAlongX * this.tilesize;
      playerMoved = true;
    }
    if(player.moveAlongY != 0){
      player.y = player.y + player.moveAlongY * this.tilesize;
      playerMoved = true;
    }
    return playerMoved;
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
