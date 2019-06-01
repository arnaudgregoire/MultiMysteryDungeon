const PlayerModel = require('../models/playerModel');

class DbManager {
    static savePlayer(player) {
        PlayerModel.find({player_id:player.playerId}).then((docs,err)=>{
            if (docs.length == 1){
                PlayerModel.updateOne(
                    {
                        player_id:player.playerId
                    },
                    {
                        x:player.x,
                        y:player.y,
                        pokedex_idx:player.pokedex_idx,
                        orientation:player.orientation,
                        action:player.action
                    }
                ).then((res) =>{
                    console.log("player " + player.playerId + " updated");
                });
            }else if (docs.length == 0){                
                PlayerModel.create(
                    {
                        player_id:player.playerId,
                        x:player.x,
                        y:player.y,
                        pokedex_idx:player.pokedex_idx,
                        orientation:player.orientation,
                        action:player.action
                    }
                ).then((res) =>{
                    console.log("player " + player.playerId + " created");
                });
            }
            else{
                console.log("multiples players with same user id : "+ player.playerId +" detected!");
            }
        });
    }
}

module.exports = DbManager;
