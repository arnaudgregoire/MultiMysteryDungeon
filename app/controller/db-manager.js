const PlayerModel = require("../model/player-model");
const Player = require("../type/entity/player");
const Pokemon = require("../type/pokemon/pokemon");
const GenericPokemonModel = require("../model/generic-pokemon-model");
const PokemonModel = require("../model/pokemon-model");
const MdoFactory = require('../type/MdoFactory');

class DbManager 
{
  static loadGenericPokemon()
  {
    return new Promise(
      function (resolve, reject)
      {
        GenericPokemonModel.find({}).then((docs,err) => 
        {
          if(docs.length != 151)
          {
            reject(new Error("wrong pokemons number loaded (expected 151)"));
          }
          else{
            resolve(docs);
          }
        })
      }
    )
  }

  static loadPlayer(userId)
  {
    // We try to find a user that has the fiven player id
    return new Promise(
      function (resolve, reject) 
      {
        PlayerModel.find({user_id: userId}).then((docs,err) => 
        {
          if (docs.length == 1) 
          {
            let doc = docs[0];
            let player = new Player(doc.user_id, doc.x, doc.y, doc.name, doc.pokemon_id, doc.belly, doc.status, doc.mapId, doc.stageCompleted);
            doc.inventory.forEach(item => {
              let obj = MdoFactory.createMdoObject(item.x, item.y, item.type);
              obj.id = item.id;
              player.inventory.push(obj);
            });
            player.orientation = doc.orientation;
            player.action = doc.action;
            if(player.action == '6')
            {
              player.turnPlayed = true;
            }
            else 
            {
              player.turnPlayed = false;
            }
            console.log("player " + userId + " loaded");
            resolve(player);
          }
          //  If no player found, we return a resolve promise with a code error of "0", meaning 0 document found
          else if (docs.length == 0) 
          {
            resolve(0);
          }
          else 
          {
            reject(new Error("multiples players with same user id : "+ userId +" detected!"));
          }
        }
      )}
    )
  };

  static loadPokemon(pokemonId)
  {
    // We try to find a user that has the fiven pokemon id
    return new Promise(
      function (resolve, reject)
       {
        PokemonModel.find({uniqid: pokemonId}).then((docs,err) =>
         {
          if (docs.length == 1) 
          {
            let doc = docs[0];
            let pokemon = new Pokemon(
              doc.level,
              doc.ivs,
              doc.evs,
              doc.stats,
              doc.gender,
              doc.shiny,
              doc.happiness,
              doc.nature,
              doc.nickname,
              doc.name,
              doc.types,
              doc.ability,
              doc.health,
              doc.uniqid,
              doc.gameIndex);
            console.log("pokemon " + pokemonId + " loaded");
            resolve(pokemon);
          }
          //  If no player found, we return a resolve promise with a code error of "0", meaning 0 document found
          else if (docs.length == 0) 
          {
            resolve(0);
          }
          else {
            reject(new Error("multiples pokemons with same pokemon id : "+ pokemonId +" detected!"));
          }
        }
      )}
    )
  };

  static savePokemon(pokemon)
  {    
    return new Promise(
      function (resolve, reject) 
      {
        // We try to find a user that has the given player id
        PokemonModel.find({uniqid:pokemon.uniqid}).then((docs,err)=>
        {
          // 1 document : we update the document we found
          if (docs.length == 1)
          {
            PokemonModel.updateOne(
              {
                uniqid:pokemon.uniqid
              },
              {
                level: pokemon.level,
                ivs: pokemon.ivs,
                evs: pokemon.evs,
                stats: pokemon.stats,
                gender: pokemon.gender,
                shiny: pokemon.shiny,
                happiness: pokemon.happiness,
                nature: pokemon.nature,
                nickname: pokemon.nickname,
                name: pokemon.name,
                types: pokemon.types,
                ability: pokemon.ability,
                health: pokemon.health,
                gameIndex: pokemon.gameIndex
              }
            ).then((res) =>
            {
              console.log("pokemon " + pokemon.uniqid + " updated");
              resolve(pokemon.uniqid);
            });
          }
          // 0 document: we create a new document with the given player id
          else if (docs.length == 0) 
          {
            PokemonModel.create(
              {
                uniqid: pokemon.uniqid,
                level: pokemon.level,
                ivs: pokemon.ivs,
                evs: pokemon.evs,
                stats: pokemon.stats,
                gender: pokemon.gender,
                shiny: pokemon.shiny,
                happiness: pokemon.happiness,
                nature: pokemon.nature,
                nickname: pokemon.nickname,
                name: pokemon.name,
                types: pokemon.types,
                ability: pokemon.ability,
                health: pokemon.health,
                gameIndex: pokemon.gameIndex
              }
            ).then((res) =>{
              console.log("pokemon " + pokemon.uniqid + " saved");
              resolve(pokemon.uniqid);
            });
          }
          // Case other than 0 and 1, there is an inconsistency in the data
          else{
            reject(new Error("multiples pokemons with same pokemon id : "+ pokemon.uniqid +" detected!"));
          }
        });
      }
    )
  }

  static savePlayer(player) 
  {
    return new Promise(
      function (resolve, reject) 
      {
        // We try to find a user that has the given player id
        PlayerModel.find({user_id:player.userId}).then((docs,err)=>
        {
          // 1 document : we update the document we found
          if (docs.length == 1)
          {
            PlayerModel.updateOne(
              {
                user_id:player.userId
              },
              {
                x:player.x,
                y:player.y,
                pokemon_id:player.pokemonId,
                orientation:player.orientation,
                action:player.action,
                name: player.name,
                belly: player.belly,
                status: player.status,
                inventory: player.inventory,
                mapId: player.mapId,
                stageCompleted: player.stageCompleted
              }
            ).then((res) =>
            {
              console.log("player " + player.userId + " updated");
              resolve(player.id);
            });
          }
          // 0 document: we create a new document with the given player id
          else if (docs.length == 0) 
          {
            PlayerModel.create(
              {
                user_id:player.userId,
                x:player.x,
                y:player.y,
                pokemon_id:player.pokemonId,
                orientation:player.orientation,
                action:player.action,
                name: player.name,
                belly: player.belly,
                status: player.status,
                inventory: player.inventory,
                mapId: player.mapId,
                stageCompleted: player.stageCompleted
              }
            ).then((res) =>
            {
              console.log("player " + player.userId + " saved");
              resolve(player.userId);
            });
          }
          // Case other than 0 and 1, there is an inconsistency in the data
          else
          {
            reject(new Error("multiples players with same user id : "+ player.userId +" detected!"));
          }
        });
      }
    )
  }
}

module.exports = DbManager;
