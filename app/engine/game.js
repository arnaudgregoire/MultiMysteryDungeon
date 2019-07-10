const Player = require("../model/type/player");
const Pokemon = require("../model/type/pokemon");
const ENUM_STAT = require("../model/type/enums").ENUM_STAT;
const ENUM_GENDER = require("../model/type/enums").ENUM_GENDER;
const ENUM_NATURE = require("../model/type/enums").ENUM_NATURE;
const pokemonMath = require("./pokemonMath");
const fs = require("fs");

class Game {
  constructor(config) {
    this.width = config.width;
    this.height = config.height;
    this.players = [];
    this.ias = [];
    this.turn = 0;
    this.genericPokemonDBs = [];
    let mapCSV = String(fs.readFileSync(__dirname + "/../generation/maps/testMap.csv"));
    this.map = mapCSV.trim().split('\n').map(function (row) { return row.split(',') });
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  createPokemon(uniqid, gameIndex){
      let level = 5;
      let happiness = 0;
      let nickname = "";
      let nature = ENUM_NATURE[this.getRandomInt(ENUM_NATURE.length)];
      let gender = ENUM_GENDER[this.getRandomInt(ENUM_GENDER.length)];
      let genericPokemon = this.getGenericPokemonDbByGameIndex(gameIndex);
      let ability = genericPokemon.abilities[this.getRandomInt(genericPokemon.abilities.length)].ability;
      let ivs = [];
      let shiny = false;
      ENUM_STAT.forEach((stat)=>{
        ivs.push({name:stat, value: this.getRandomInt(31)});
      });
      let evs = [];
      ENUM_STAT.forEach((stat)=>{
        evs.push({name:stat, value: 0});
      });
      let stats = [];
      for (let i = 0; i < ENUM_STAT.length - 1; i++) {
        stats.push({
          name:ENUM_STAT[i],
          value: pokemonMath.computeStat(
            ENUM_STAT[i],
            genericPokemon.stats[i].baseStat,
            ivs[i].value,
            evs[i].value,
            level,
            nature)
        })
      }
      let hp = pokemonMath.computeHP(
        genericPokemon.stats[5].baseStat,
        ivs[5].value,
        evs[5].value,
        level);

      stats.push({
        name:ENUM_STAT[5],
        value: hp
      });

      return new Pokemon(
        level,
        ivs,
        evs,
        stats,
        gender,
        shiny,
        happiness,
        nature,
        nickname,
        genericPokemon.name,
        genericPokemon.types,
        ability,
        hp,
        uniqid,
        gameIndex) 
  }


  getGenericPokemonDbByGameIndex(gameIndex){
    let pokemonFound =  null;
    this.genericPokemonDBs.forEach((genericPokemon) =>{
      if(gameIndex ==  genericPokemon.gameIndex){
        pokemonFound = genericPokemon;
      }
    })
    return pokemonFound;
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
    // check if move
    if(player.moveAlongX != 0 || player.moveAlongY != 0){
      //right
      if(player.moveAlongX == 1 && player.moveAlongY == 0){
        if(!this.collide(player, player.x + 1, player.y)){
          playerMoved = true;
        }
      }
      //left
      else if(player.moveAlongX == -1 && player.moveAlongY == 0){
        if(!this.collide(player, player.x -1, player.y)){
          playerMoved = true;
        }
      }
      //up
      else if(player.moveAlongX == 0 && player.moveAlongY == 1){
        if(!this.collide(player, player.x, player.y + 1)){
          playerMoved = true;
        }
      }
      //down
      else if(player.moveAlongX == 0 && player.moveAlongY == -1){
        if(!this.collide(player, player.x, player.y - 1)){
          playerMoved = true;
        }
      }
      //down right
      else if(player.moveAlongX == 1 && player.moveAlongY == -1){
        if(!this.collide(player, player.x + 1, player.y - 1)){
          playerMoved = true;
        }
      }
      //down left
      else if(player.moveAlongX == - 1 && player.moveAlongY == -1){
        if(!this.collide(player, player.x - 1, player.y - 1)){
          playerMoved = true;
        }
      }
      //up right
      else if(player.moveAlongX == 1 && player.moveAlongY == 1){
        if(!this.collide(player, player.x + 1, player.y + 1)){
          playerMoved = true;
        }
      }
      //up left
      else if(player.moveAlongX == - 1 && player.moveAlongY == 1){
        if(!this.collide(player, player.x - 1, player.y + 1)){
          playerMoved = true;
        }
      }
      if(playerMoved){
        player.x = player.x + player.moveAlongX;
        player.y = player.y + player.moveAlongY;
      }
    }
    return playerMoved;
  }

  /**
   * Check if the entity (pokemon) collide with the map at position x,y
   * @param {Entity} entity 
   * @param {integer} x 
   * @param {interger} y 
   */
  collide(entity, x, y){
    console.log(x,y);
    // check for map borders
    if(y >= this.map.length || y < 0 || x >= this.map[0].length || x < 0){
      return true;
    }
    // check for walls
    if(this.map[y][x] == 0){
      return true;
    }
    // check for other players
    for (let i = 0; i < this.players.length; i++) {
      if(this.players[i] != entity && this.players[i].x == x && this.players[i].y == y){
        return true;
      }
    }

    //check with ias
    for (let i = 0; i < this.ias.length; i++) {
      if(this.ias[i] != entity && this.ias[i].x == x && this.ias[i].y == y){
        return true;
      }
    }
    return false;
  }

  getPlayerById(id) {
    let found = false;
    let foundPlayer;
    this.players.forEach(player => {
      if (player.userId == id) {
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
