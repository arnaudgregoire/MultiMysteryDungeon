/*
x : pokemon position on map
y : same
gameIndex : the pokedex number of the pokemon Ex Charmander 4
id : the id of the player
*/
class Player{
  constructor(userId, x, y, name, pokemonId){
    this.userId = userId;
    this.x = x;
    this.y = y;
    this.pokemonId = pokemonId;
    this.pokemon = null;
    this.name = name;
    this.orientation = "left";
    this.action = "5";
    this.moveAlongX = 0;
    this.moveAlongY = 0;
    this.turnPlayed = false;
    this.socketId = null;
  }
}

module.exports = Player;
