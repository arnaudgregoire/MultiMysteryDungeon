const Player = require('../types/player');
const TILESIZE = 24;

class Game{
    constructor(config){
        this.width = config.width;
        this.height = config.height;
        this.players = [];
    }
    //down, downleft, left, upleft, up, upright, right, downright
    computePositions(){
        this.players.forEach(player => {
            player.x = player.x + player.moveAlongX * TILESIZE;
            player.y = player.y + player.moveAlongY * TILESIZE;
        })
    }


    getPlayerById(id){
        let found = false;
        let foundPlayer;
        this.players.forEach(player => {
            if(player.id == id){
                found = true;
                foundPlayer = player;
            };
        })
        if(found){
            return foundPlayer;
        }
        else{
            return new Error("no player for given id ( " + id +" ) found");
        }
    }

    /**
     * Check if the player is in the game
     * @param {string} id The identifiant of the player 
     */
    isPlayer(id){
        let is = false;
        this.players.forEach(player => {
            if(player.id == id){is=true};
        });
        return is;
    }

    /**
     * add given player to game.players
     * @param {Player} player 
     */
    addPlayer(player){
        this.players.push(player);
    }
}

module.exports = Game;