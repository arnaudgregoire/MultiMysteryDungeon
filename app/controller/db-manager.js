const PlayerModel = require("../model/player-model");
const Player = require("../model/type/player");
const GenericPokemonModel = require("../model/generic-pokemon-model");

class DbManager {
  static loadGenericPokemon(){
    return new Promise(
      function (resolve, reject){
        GenericPokemonModel.find({}).then((docs,err) => {
          if(docs.length != 151){
            reject(new Error("wrong pokemons number loaded (expected 151)"));
          }
          else{
            resolve(docs);
          }
        })
      }
    )
  }

  static loadPlayer(uniqid) {
    // We try to find a user that has the fiven player id
    return new Promise(
      function (resolve, reject) {
        PlayerModel.find({id: uniqid}).then((docs,err) => {
          if (docs.length == 1) {
            let doc = docs[0];
            let player = new Player(doc.uniqid, doc.x, doc.y, doc.name, doc.pokemon_id);
            player.orientation = doc.orientation;
            player.action = doc.action;
            console.log("player " + uniqid + " loaded");
            resolve(player);
          }
          //  If no player found, we return a resolve promise with a code error of "0", meaning 0 document found
          else if (docs.length == 0) {
            resolve(0);
          }
          else {
            reject(new Error("multiples players with same user id : "+ uniqid +" detected!"));
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
        PlayerModel.find({id:player.uniqid}).then((docs,err)=>{
          // 1 document : we update the document we found
          if (docs.length == 1){
            PlayerModel.updateOne(
              {
                uniqid:player.uniqid
              },
              {
                x:player.x,
                y:player.y,
                pokemon_id:player.pokemonId,
                orientation:player.orientation,
                action:player.action,
                name: player.name
              }
            ).then((res) =>{
              console.log("player " + player.uniqid + " updated");
              resolve(player.uniqid);
            });
          }
          // 0 document: we create a new document with the given player id
          else if (docs.length == 0) {
            PlayerModel.create(
              {
                uniqid:player.uniqid,
                x:player.x,
                y:player.y,
                pokemon_id:player.pokemonId,
                orientation:player.orientation,
                action:player.action,
                name: player.name
              }
            ).then((res) =>{
              console.log("player " + player.uniqid + " created");
              resolve(player.uniqid);
            });
          }
          // Case other than 0 and 1, there is an inconsistency in the data
          else{
            reject(new Error("multiples players with same user id : "+ player.uniqid +" detected!"));
          }
        });
      }
    )
  }
}

module.exports = DbManager;
