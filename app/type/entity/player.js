const Entity = require("./entity");

/*
x : pokemon position on map
y : same
gameIndex : the pokedex number of the pokemon Ex Charmander 4
id : the id of the player
*/
class Player extends Entity
{
  constructor(userId, x, y, name, pokemonId)
  {
    super(x,y,name);
    this.entityType = 'player';
    this.userId = userId;
    this.pokemonId = pokemonId;
    this.pokemon = null;
    this.moveAlongX = 0;
    this.moveAlongY = 0;
    this.socketId = null;
  }
}

module.exports = Player;
