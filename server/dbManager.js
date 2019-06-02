const PlayerModel = require('../models/playerModel');
const Player = require('../types/player');

class DbManager {
    static loadPlayer(playerId){
        // We try to find a user that has the fiven player id
        return new Promise(
            function (resolve, reject) {
                PlayerModel.find({player_id: playerId}).then((docs,err)=>{
                    if (docs.length == 1) {
                        let doc = docs[0];
                        let player = new Player(doc.player_id, doc.x, doc.y, doc.pokedex_idx);
                        player.orientation = doc.orientation;
                        player.action = doc.action;
                        console.log('player ' + playerId + 'loaded');
                        resolve(player);
                    }
                //  If no player found, we return a player object with a pokedex id of -1.
                // This way, the server knows he has to update the object with his logic
                    else if (docs.length == 0){
                        let player = new Player(playerId,0, 0,-1);
                        console.log('player ' + playerId + 'created');
                        resolve(player);
                    }
                    else{
                        reject(new Error('multiples players with same user id : "+ player.playerId +" detected!'));
                    }
                }
            )}
        )
    };
    static savePlayer(player) {
        return new Promise(
            function (resolve, reject) {
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
                                pokedex_idx:player.pokedexIdx,
                                orientation:player.orientation,
                                action:player.action
                            }
                        ).then((res) =>{
                            console.log("player " + player.playerId + " updated");
                            resolve(player.playerId);
                        });
                    // Case 0 document: we create a new document with the given player id
                    }else if (docs.length == 0){                
                        PlayerModel.create(
                            {
                                player_id:player.playerId,
                                x:player.x,
                                y:player.y,
                                pokedex_idx:player.pokedexIdx,
                                orientation:player.orientation,
                                action:player.action
                            }
                        ).then((res) =>{
                            console.log("player " + player.playerId + " created");
                            resolve(player.playerId);
                        });
                    }
                    // Case other than 0 and 1, there is an inconsistency in the data
                    else{
                        reject(new Error("multiples players with same user id : "+ player.playerId +" detected!"));
                    }
                });   
            }
        )
    }
}

module.exports = DbManager;
