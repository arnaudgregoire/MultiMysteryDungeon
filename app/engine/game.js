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
    this.world = JSON.parse(fs.readFileSync(__dirname + "/../generation/maps/test.json"));
    let map = this.world.layers[0].data;
    this.map = [];
    while(map.length){
      this.map.push(map.splice(0,50));
    };
    this.world.layers[0].data = this.map;
    //this.map = mapCSV.trim().split('\n').map(function (row) { return row.split(',') });
    this.eventEmitter = null;
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
      if(player.action != '6'){ // Dead can not play turns
        player.turnPlayed = false;
      }
    });
    this.ias.forEach(ia =>{
      ia.turnPlayed = false;
    });
    this.turn += 1;
  }

  getTurn(){
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

  computeIaTurn(){
    let directions = [-1,0,1];
    let dx = 0;
    let dy = 0;
      this.ias.forEach(ia =>{     
        dx = directions[this.getRandomInt(directions.length)];
        dy = directions[this.getRandomInt(directions.length)];
        ia.action = "5";
        if(!(dx == 0 && dy == 0)){
          if(!this.collide(ia, ia.x + dx,ia.y + dy)){
            ia.orientation = this.getOrientation(dx, dy);
            ia.x = ia.x + dx;
            ia.y = ia.y + dy;
          }
        }
        ia.turnPlayed = true;
      })
  }

  getOrientation(dx,dy){
    if(dx == 0 && dy == 1){
      return 'down';
    }
    else if(dx == 0 && dy == -1){
      return 'up';
    }
    else if(dx == 1 && dy == 0){
      return 'right';
    }
    else if(dx == -1 && dy == 0){
      return 'left';
    }
    else if(dx == 1 && dy == 1){
      return 'downright';
    }
    else if(dx == 1 && dy == -1){
      return 'upright';
    }
    else if(dx == -1 && dy == 1){
      return 'downleft';
    }
    else if(dx == -1 && dy == -1){
      return 'upleft';
    }
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
    return this.players.filter(p => p.id === id).length > 0;
  }

  /**
   * Method called by the game controller when simple physical attack is triggered client side
   * @param {*} player 
   */
  playPhysicalAttack(player){
    let potentialEntity = this.collidePhysicalAttack(player);
    if(potentialEntity){
      this.dealPhysicalAttack(player, potentialEntity);
    }
  }

  /**
   * Deal Damage to entity damaged by an attack
   * @param {*} player 
   */
  dealPhysicalAttack(player, entity){
    let conversion = {
      "left":"right",
      "up":"down",
      "down":"up",
      "right":"left",
      "upright":"downleft",
      "upleft":"downleft",
      "downleft":"upright",
      "downright":"upleft"
    };
    let damage = pokemonMath.computeDamage(player.pokemon.level,player.pokemon.stats[4].value,entity.pokemon.stats[3].value,20,1);
    entity.pokemon.health = entity.pokemon.health - damage;
    this.eventEmitter.emit('server-message',
    {
      message: player.name + ' ( ' + player.pokemon.name + ' ) ' + ' attacked ' + entity.pokemon.name  + ' dealing ' + damage + ' HP',
      username:"Server"
    });
    if(entity.pokemon.health <= 0){  
      this.onEntityKO(entity);
    }
    else{
      entity.action = "3";
      entity.orientation = conversion[player.orientation];
      setTimeout(()=>{entity.action = "5"},500);
    }
  }

  onEntityKO(entity){
    entity.action = "6"; //KO state
    entity.turnPlayed = true;
    
    switch (entity.entityType) {
      case 'player':
          this.eventEmitter.emit('server-message',
          {
            message: entity.name + ' ( ' + entity.pokemon.name + ' ) ' + ' is KO',
            username:"Server"
          });
        break;
      
      case 'ia':
          this.eventEmitter.emit('server-message',
          {
            message: entity.pokemon.name  + ' is KO',
            username:"Server"
          });
          let index = this.ias.indexOf(entity);
          if(index > -1){
            this.ias.splice(index, 1);
          }
          this.eventEmitter.emit('entity-suppression', entity);
        break;

      default:
        break;
    }
  }

  /**
   * Check if a simple physical attack of a pokemon hit an other entity
   * @param {*} player 
   */
  collidePhysicalAttack(player){
    let conversion = {
      "left":[-1,0],
      "up":[0,-1],
      "right":[1,0],
      "down":[0,1],
      "downleft":[-1,1],
      "downright":[1,1],
      "upleft":[-1,-1],
      "upright":[1,-1]
    }
    let x = player.x + conversion[player.orientation][0];
    let y = player.y + conversion[player.orientation][1];
    for (let i = 0; i < this.ias.length; i++) {
      if(
        this.ias[i].x == x
     && this.ias[i].y == y){
       return this.ias[i];
     } 
    }
    for (let i = 0; i < this.players.length; i++) {
      if(
           this.players[i].x == x
        && this.players[i].y == y
        && this.players[i].userId != player.userId){
        return this.players[i];
      }
    }
    return false;
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
