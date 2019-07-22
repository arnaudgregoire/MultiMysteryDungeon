const EventEmitter = require('events');

class PlayerController{
  constructor(socket, eventEmitter){
    this.userId = socket.handshake.session.passport.user._id;
    this.name = socket.handshake.session.passport.user.name;
    this.email = socket.handshake.session.passport.user.email;
    this.socket = socket;
    this.input= {
      left: false,
      right: false,
      up: false,
      down: false
    }
    this.eventEmitter = eventEmitter;
    console.log(this.email + " connected");
  }

  initialize(player){
    let self = this;
    self.socket.on('onClientLoad', function(){
      self.socket.emit("sendPlayer", player);
      self.onClientLoad();
    })
  }

  onClientLoad(){
    let self = this;
    // send the players object to the new player
    self.eventEmitter.emit('currentEntities', self);
    // update all other players of the new player
    self.eventEmitter.emit('newPlayer', self);
    // in case of disconnection
    self.socket.on("disconnect", function(){
      self.eventEmitter.emit('disconnect', self);
    });
    // when a player moves, update the player data
    self.socket.on("playerInput", function (input) {
      console.log(input);
      self.input = input;
      self.eventEmitter.emit('playerInput', self);
    });
    self.socket.on('submit-chatline', function(chatline){
      // await ChatModel.create({ email, message });
      self.eventEmitter.emit('submit-chatline', {
        username:self.name,
        message:chatline});
    })
  }
}

module.exports = PlayerController;
