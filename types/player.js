/*
x : pokemon position on map
y : same
pokedexIdx : the pokedex number of the pokemon Ex Charmander 4
id : the id of the player
*/
class Player{
    
    constructor(id, x, y, pokedexIdx, name){
        this.id = id;
        this.x = x;
        this.y = y;
        this.pokedexIdx = pokedexIdx;
        this.name = name;
        this.orientation = 'left';
        this.action = '0';
        this.moveAlongX = 0;
        this.moveAlongY = 0;
    }
}
module.exports = Player;
