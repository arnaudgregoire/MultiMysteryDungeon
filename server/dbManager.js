const PlayerModel = require('../models/playerModel');
const Player = require('../types/player');

class DbManager {
    static loadPlayer(playerId){
        // We try to find a user that has the fiven player id
        return new Promise(
            function (resolve, reject) {
                PlayerModel.find({id: playerId}).then((docs,err)=>{
                    if (docs.length == 1) {
                        let doc = docs[0];
                        let player = new Player(doc.id, doc.x, doc.y, doc.pokedex_idx, doc.name);
                        player.orientation = doc.orientation;
                        player.action = doc.action;
                        console.log('player ' + playerId + ' loaded');
                        resolve(player);
                    }
                //  If no player found, we return a resolve promise with a code error of '0', meaning 0 document found
                    else if (docs.length == 0){
                        resolve(0);
                    }
                    else{
                        reject(new Error("multiples players with same user id : "+ playerId +" detected!"));
                    }
                }
            )}
        )
    };
    static savePlayer(player) {
        //console.log(player);
        return new Promise(
            function (resolve, reject) {
                     // We try to find a user that has the given player id
                PlayerModel.find({id:player.id}).then((docs,err)=>{
                    // Case 1 document : we update the document we found
                    if (docs.length == 1){
                        PlayerModel.updateOne(
                            {
                                id:player.id
                            },
                            {
                                x:player.x,
                                y:player.y,
                                pokedex_idx:player.pokedexIdx,
                                orientation:player.orientation,
                                action:player.action,
                                name: player.name
                            }
                        ).then((res) =>{
                            console.log("player " + player.id + " updated");
                            resolve(player.id);
                        });
                    // Case 0 document: we create a new document with the given player id
                    }else if (docs.length == 0){                
                        PlayerModel.create(
                            {
                                id:player.id,
                                x:player.x,
                                y:player.y,
                                pokedex_idx:player.pokedexIdx,
                                orientation:player.orientation,
                                action:player.action,
                                name: player.name
                            }
                        ).then((res) =>{
                            console.log("player " + player.id + " created");
                            resolve(player.id);
                        });
                    }
                    // Case other than 0 and 1, there is an inconsistency in the data
                    else{
                        reject(new Error("multiples players with same user id : "+ player.id +" detected!"));
                    }
                });   
            }
        )
    }
}

module.exports = DbManager;
