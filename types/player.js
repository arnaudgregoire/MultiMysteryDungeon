/*
x : pokemon position on map
y : same
pokedexIdx : the pokedex number of the pokemon Ex Charmander 4
playerId : the id of the player
*/
class Player{
    
    constructor(playerId, x, y, pokedexIdx){
        this.playerId = playerId;
        this.x = x;
        this.y = y;
        this.socketId = "";
        this.pokedexIdx = pokedexIdx;
        this.orientation = 'left';
        this.action = '0';
        this.input= {
            left: false,
            right: false,
            up: false,
            down: false
        }
    }
}
module.exports = Player;
