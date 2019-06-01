const PlayerModel = require('../models/playerModel');

class DbManager {
    static savePlayer(player) {
        // We try to find a user that has the given player id
        PlayerModel.find({player_id:player.playerId}).then((docs,err)=>{
            // Case 1 document : we update the document we found
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
            // Case 0 document: we create a new document with the given player id
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
            // Case other than 0 and 1, there is an inconsistency in the data
            else{
                console.log("multiples players with same user id : "+ player.playerId +" detected!");
            }
        });
    }
}

module.exports = DbManager;
