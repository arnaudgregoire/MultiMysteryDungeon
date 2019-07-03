/*
x : pokemon position on map
y : same
gameIndex : the pokedex number of the pokemon Ex Charmander 4
id : the id of the player
*/
class Player{
  constructor(uniqid, x, y, name, pokemonId){
    this.uniqid = uniqid;
    this.x = x;
    this.y = y;
    this.pokemonId = pokemonId;
    this.name = name;
    this.orientation = "left";
    this.action = "0";
    this.moveAlongX = 0;
    this.moveAlongY = 0;
    this.turnPlayed = false;
  }
}

module.exports = Player;
