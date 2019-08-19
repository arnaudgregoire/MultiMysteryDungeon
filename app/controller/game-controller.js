const EventEmitter = require('events'); 
const uniqid = require('uniqid');
const DbManager = require("./db-manager");
const PlayerController = require("./player-controller");
const Game = require("../engine/game");
const Player = require("../type/entity/player");
const Ia = require("../type/entity/ia");
const genericPokemonDB = require('../type/pokemon/generic-pokemon-db');
const ENUM_STATUS = require('../type/enums').ENUM_STATUS;
const utils = require('../engine/utils');


class GameController 
{
  constructor(websocket, config) 
  {
    this.websocket = websocket;
    this.playerControllers = [];
    this.pokedex = [1,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,12,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,83,142,144,147,148,149,150];
    this.game = new Game(config);
    this.config = config;
    DbManager.loadGenericPokemon().then((docs)=>
    {
      docs.forEach((doc)=>
      {
        //console.log("loading " + doc.name + "...");
        this.game.genericPokemonDBs.push(new genericPokemonDB(doc));
      })
    }).then(()=>
    {
      console.log("Generic Pokemons loaded from DB");
      this.eventEmitter = new EventEmitter();
      this.game.eventEmitter =this.eventEmitter;
      this.initialize();
    })
  }

  initialize() {
    let self = this;
    self.initializeConnection();
    self.initializeIas();
    setInterval(this.update.bind(this), 100);
    self.eventEmitter.on('submit-chatline',function (data)
    {
      self.websocket.emit("new-message", data);
    });
    self.eventEmitter.on('playerInput', (controller)=>
    {
      self.onPlayerInput(controller);
    });
    self.eventEmitter.on('entity-suppression', (entity)=>
    {
      self.onEntitySuppression(entity);
    });
    self.eventEmitter.on('object-suppression', (entity)=>
    {
      self.onObjectSuppression(entity);
    });
    self.eventEmitter.on('disconnect', (controller)=>
    {
      self.onPlayerDisconnect(controller);
    });
    self.eventEmitter.on('currentObjects', (controller) =>
    {
      controller.socket.emit("currentObjects", this.game.getVisibleObjects());
    });
    self.eventEmitter.on('currentEntities', (controller)=>
    {
      controller.socket.emit("currentEntities", {"players":this.game.players, "ias":this.game.ias});
    });
    self.eventEmitter.on('newPlayer', (controller)=>
    {
      controller.socket.broadcast.emit("newPlayer", self.game.getPlayerById(controller.userId));
    });
    self.eventEmitter.on('new-object',(object)=>
    {
      self.websocket.emit('new-object', object);
    })
    self.eventEmitter.on('server-message', (message)=>
    {
      self.websocket.emit('server-message', message);
    });
    self.eventEmitter.on('update-inventory', (player)=>
    {
      let controller = self.getPlayerControllerById(player.userId);
      controller.onInventoryUpdate(player);
    })
  }

  onObjectSuppression(obj)
  {
    this.websocket.emit('object-suppression',{'id': obj.id});
  }

  onEntitySuppression(entity)
  {
    let id = '';
    switch (entity.entityType)
    {
      case 'player':
        id = entity.userId;
        break;
    
      case 'ia':
        id = entity.uniqid;
        
      default:
        break;
    }
    this.websocket.emit('entity-suppression',{'entityType': entity.entityType, 'id': id});
  }

  initializeIas()
  {
    for (let i = 0; i < 10; i++) 
    {
      this.game.ias.push(this.createIa());
    }
  }

  createIa()
  {
    let id = uniqid();
    let pokemon = this.game.createPokemon(id,this.pokedex[utils.randomIntFromInterval(0,this.pokedex.length - 1)]);
    let x = 0;
    let y = 0;
    while (this.game.map[y][x] != 1)
    {
      x = utils.randomIntFromInterval(0,49);
      y = utils.randomIntFromInterval(0,49);
    }
    return new Ia(id,x,y,pokemon.name,pokemon);
  }

  update()
  {
    if(this.game.checkEndTurn())
    {
      this.game.computeIaTurn();
      this.game.setupNewTurn();
      this.websocket.emit("server-message",
      {
        message:"Turn " + this.game.getTurn(),
        username:"Server"
      });
    }
    this.game.computePositions();
    this.websocket.emit("updateEntities", {"players":this.game.players, "ias":this.game.ias});
  }

  initializeConnection() 
  {
    let self = this;
    // on new connections
    self.websocket.on("connection",function(socket)
    {
      socket.emit("get-map",self.game.map);
      let userId = socket.handshake.session.passport.user._id;
      let name = socket.handshake.session.passport.user.name;
      let randomPokedexNumber = self.pokedex[utils.randomIntFromInterval(0,self.pokedex.length - 1)];
      
      // if no player id corresponding in game players,then try to load it from db
      if(!self.game.isPlayer(userId))
      {
        //console.log("player doesnt exist in world");
        DbManager.loadPlayer(userId)
        .then((playerDB)=>
        {
          // if no player corresponding to the id in db, then create a new player and his pokemon
          let player = playerDB;
          DbManager.loadPokemon(player.pokemonId)
          .then((pokemonDB)=>
          {
            let pokemon = pokemonDB;
            //if pokemon found, attach it to the player
            if(pokemon != 0 && player != 0)
            {
              player.pokemon = pokemon;
            }
            // if no player found, create a pokemon and a player
            else if(player == 0 && pokemon == 0)
            {
              console.log("creating player with name : " + name);
              let pokemonId = uniqid();
              player = new Player(userId, self.game.spawn_point_player.x, self.game.spawn_point_player.y, name, pokemonId, 100, ENUM_STATUS.NORMAL,self.game.mapId);  
              console.log("creating pokemon with name : " + name);
              player.pokemon =self.game.createPokemon(pokemonId,randomPokedexNumber);
            }
            // no pokemon found but player found
            else if(pokemon == 0 && player != 0)
            {
              player.pokemon =self.game.createPokemon(player.pokemonId,randomPokedexNumber);
            }
            // no player but pokemon => error
            else if(pokemon != 0 && player == 0)
            {
              return new Error("pokemon found (id : "+ pokemon.uniqid +") but no player found");
            }
            player.socketId = socket.id;

            // if player coordinates refers to an old stage, place the player at the spawn point of the new stage
            if(player.mapId != self.game.mapId)
            {
              player.x = self.game.spawn_point_player.x;
              player.y = self.game.spawn_point_player.y;
              player.mapId = self.game.mapId;
            }
            self.game.addPlayer(player);
            let controller = new PlayerController(socket, self.eventEmitter);
            controller.initialize(player);
            self.playerControllers.push(controller);
          })
        })
      }
      else
      {
        socket.emit("alreadyLog",socket.handshake.session.passport.user.email);
        socket.disconnect();
      }
    })
  }
  

  removeObjectFromArray(object, array)
  {
    let index = array.indexOf(object);
    if(index !== -1)
    {
      array.splice(index, 1);
    }
    else
    {
      return new Error("given object not found in given array");
    }
  }

  onPlayerDisconnect(controller)
  {
    // remove this player from our players object
    // save player properties in db
    let self = this;
    //console.log(controller);
    let player = self.game.getPlayerById(controller.userId);
    DbManager.savePlayer(player).then((res)=>
    {
      DbManager.savePokemon(player.pokemon).then((res)=>
      {
        // remove player from server
        self.removeObjectFromArray(player, self.game.players);
        player = null;
        self.websocket.emit("entity-suppression", {entityType:'player', id: controller.userId});
        console.log(controller.email +" disconnected");
        // delete player controller
        self.removeObjectFromArray(controller, self.playerControllers);
        controller = null;
      })
    })
  }

  /*
  Set orientation of the player, it will be used to render proper pokemon sprite client side
  Possible orientation are : down, downleft, left, upleft, up, upright, right, downright
  */
  onPlayerInput(controller)
  {
    let self = this;
    let player = self.game.getPlayerById(controller.userId);
    let input = controller.input;

    // if player is dead, he can't do anything
    if(player.action != '6')
    {
      if(input.attack)
      {
        this.onPlayerAttack(player);
      }
      else
      {      
        self.setOrientation(player, input);
        self.setMoveAlongAxes(player, input);
        self.setAction(player, input);
      }
    }
  }

  onPlayerAttack(player)
  {
    if(!player.turnPlayed)
    {
      player.action = "1";
      //after .5s, the player return to idle state
      setTimeout(()=>{player.action = "5"},500);
      this.game.playPhysicalAttack(player);
      player.turnPlayed = true;
    }
  }

  /*
  Set action that the player is doing
  Possibles actions are : 0: moving, 1: physical attack, 2: special attack, 3: hurt, 4: sleep
  TODO support other actions than moving and idle
  */
  setAction(player, input)
  {
    //check if the player is moving in any directions, if not he is idle
    if(!(input.right || input.down || input.left || input.up || input.attack))
    {
      player.action = "5";
    }
    else
    {
      player.action = "0";
    }
  }

  /**
   * Set user input direction from left, right, down up 
   * to move Along axis X and Y -1 , 0 , 1
   * @param {Player} player 
   * @param {left,right,down,up} input 
   */
  setMoveAlongAxes(player, input)
  {
    player.moveAlongX = 0;
    player.moveAlongY = 0;
    if (input.left)
    {
      player.moveAlongX = -1;
    }
    if (input.right)
    {
      player.moveAlongX = 1;
    }
    if (input.down)
    {
      player.moveAlongY = 1;
    }
    if (input.up)
    {
      player.moveAlongY = -1;
    }
  }

  setOrientation(player, input) 
  {
    if(input.left && input.up)
    {
      player.orientation = "upleft"
    }
    else if(input.left && input.down)
    {
      player.orientation = "downleft"
    }
    else if(input.right && input.up)
    {
      player.orientation = "upright"
    }
    else if(input.right && input.down)
    {
      player.orientation = "downright"
    }
    else if (input.right)
    {
      player.orientation = "right"
    }
    else if(input.left)
    {
      player.orientation = "left"
    }
    else if(input.up)
    {
      player.orientation = "up"
    }
    else if(input.down)
    {
      player.orientation = "down"
    }
  }

  /**
  * Check if the player id is one of the player Controller id
  * @param {string} userId
  */
  isPlayerController(userId) {
    let is = false;
    this.playerControllers.forEach(controller =>
    {
      if(controller.userId == userId)
      {
        is=true
      };
    });
    return is;
  }

  getPlayerControllerById(userId)
  {
    for (let i = 0; i < this.playerControllers.length; i++) 
    {         
      if(this.playerControllers[i].userId == userId)
      {
        return this.playerControllers[i];
      }
    }
    return new Error("no player controller found for given id ( " +userId+ " )");
  }
}

module.exports = GameController;
