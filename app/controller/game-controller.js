const Timers = require("timers");
const DbManager = require("./db-manager");
const PlayerController = require("./player-controller");
const Game = require("../engine/game");
const Player = require("../model/type/player");
const EventEmitter = require('events');


class GameController {

  constructor(websocket, config) {
    this.websocket = websocket;
    this.playerControllers = [];
    this.pokedex = [1,2,5,7,12,25];
    this.game = new Game(config);
    this.eventEmitter = new EventEmitter();
    this.initialize();
  }

  initialize() {
    let self = this;
    self.initializeConnection();
    setInterval(this.update.bind(this), 50);
    self.eventEmitter.on('submit-chatline',function (data){
      self.websocket.emit("new-message", data);
    });
    self.eventEmitter.on('playerInput', (controller)=>{
      self.onPlayerInput(controller);
    });
    self.eventEmitter.on('disconnect', (controller)=>{
      self.onPlayerDisconnect(controller);
    });
    self.eventEmitter.on('currentPlayers', (controller)=>{
      controller.socket.emit("currentPlayers", self.game.players);
    });
    self.eventEmitter.on('newPlayer', (controller)=>{
      controller.socket.broadcast.emit("newPlayer", self.game.getPlayerById(controller.playerId));
    })
  }

  update() {
    if(this.game.checkEndTurn()){
      this.websocket.emit("turnUpdate", {
        message:"Turn " + this.game.setupNewTurn(),
        username:"Server"
      });
    }
    this.game.computePositions();
    this.websocket.emit("playerUpdates", this.game.players);
  }

  initializeConnection() {
    let self = this;
    // on new connections
    self.websocket.on("connection",function(socket){
      socket.emit("sendId", socket.id);
      let playerId = socket.handshake.session.passport.user._id;
      let name = socket.handshake.session.passport.user.name;
      let randomPokedexNumber = self.pokedex[self.randomIntFromInterval(0,self.pokedex.length - 1)];
      // if no player id corresponding in game players,then try to load it from db
      if(!self.game.isPlayer(playerId)){
        //console.log("player doesnt exist in world");
        self.loadPlayer(playerId)
        .then((dbPlayer)=>{
          // if no player corresponding to the id in db, then create a new player
          let player = dbPlayer;
          if(player == 0){
            //console.log("new player created");
            player = new Player(playerId, 240, 240, randomPokedexNumber, name);
          }
          player.socketId = socket.id;
          self.game.addPlayer(player);
          let controller = new PlayerController(socket, self.eventEmitter);
          controller.initialize();
          self.playerControllers.push(controller);
        })
      }
      else{
        socket.emit("alreadyLog",socket.handshake.session.passport.user.email);
        socket.disconnect();
      }
    })
  }

  removeObjectFromArray(object, array) {
    let index = array.indexOf(object);
    if(index !== -1) {
      array.splice(index, 1);
    }
    else{
      return new Error("given object not found in given array");
    }
  }

  onPlayerDisconnect(controller) {
    // remove this player from our players object
    // save player properties in db
    let self = this;
    let player = self.game.getPlayerById(controller.playerId);
    this.savePlayer(player).then((res)=>{
      // remove player from server
      self.removeObjectFromArray(player, self.game.players);
      player = null;
      self.websocket.emit("disconnect", controller.playerId);
      console.log(controller.email +" disconnected");
      // delete player controller
      self.removeObjectFromArray(controller, self.playerControllers);
      controller = null;
    });
  }

  /*
  Set orientation of the player, it will be used to render proper pokemon sprite client side
  Possible orientation are : down, downleft, left, upleft, up, upright, right, downright
  */
  onPlayerInput(controller) {
    let input = controller.input;
    let self = this;
    let player = self.game.getPlayerById(controller.playerId);
    self.setOrientation(player, input);
    self.setMoveAlongAxes(player, input);
    self.setAction(player, input);
  }

  /*
  Set action that the player is doing
  Possibles actions are : 0: moving, 1: physical attack, 2: special attack, 3: hurt, 4: sleep
  TODO support other actions than moving and idle
  */
  setAction(player, input) {
    //check if the player is moving in any directions, if not he is idle
    if(!(input.right || input.down || input.left || input.right)){
      player.action = "5";
    }
    // TODO implement more logic than if not afk then moving
    else{
      player.action = "0";
    }
  }

  setMoveAlongAxes(player, input) {
    player.moveAlongX = 0;
    player.moveAlongY = 0;
    if (input.left) {
      player.moveAlongX = -1;
    }
    if (input.right) {
      player.moveAlongX = 1;
    }
    if (input.down) {
      player.moveAlongY = 1;
    }
    if (input.up) {
      player.moveAlongY = -1;
    }
  }

  setOrientation(player, input) {
    if(input.left && input.up){
      player.orientation = "upleft"
    }
    else if(input.left && input.down){
      player.orientation = "downleft"
    }
    else if(input.right && input.up){
      player.orientation = "upright"
    }
    else if(input.right && input.down){
      player.orientation = "downright"
    }
    else if (input.right) {
      player.orientation = "right"
    }
    else if(input.left){
      player.orientation = "left"
    }
    else if(input.up){
      player.orientation = "up"
    }
    else if(input.down){
      player.orientation = "down"
    }
  }

  savePlayer(player) {
    return DbManager.savePlayer(player);
  }

  loadPlayer(playerId) {
    return DbManager.loadPlayer(playerId);
  }

  /**
  * Check if the player id is one of the player Controller id
  * @param {string} playerId
  */
  isPlayerController(playerId) {
    let is = false;
    this.playerControllers.forEach(controller => {
      if(controller.playerId == playerId){is=true};
    });
    return is;
  }

  getPlayerControllerById(playerId) {
    this.playerControllers.forEach(player => {
      if(player.playerId == playerId){return player}
    })
    return new Error("no player controller found for given id ( " +playerId+ " )");
  }

  // min and max included
  randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min)
  }
}

module.exports = GameController;
