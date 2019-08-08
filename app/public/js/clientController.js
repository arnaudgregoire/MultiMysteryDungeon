function ClientController() {
  this.uiSceneCreated = false;
  this.gameSceneCreated = false;
  this.socket = io();
  this.initialize();
}

ClientController.prototype.initialize = function ()
{
  this.socket.on("get-world", this.initializeWorld.bind(this));
};

ClientController.prototype.initializeWorld = function (world) 
{
  this.chatController = new ChatController();
  this.gameView = new GameView();
  window.world = world;
  // auto tile the world and reshape the result as 1D Array for phaser
  var tilingMatrix = AutoTiling.tileMatrix(8, window.world.layers[0].data, this.gameView.config.autoTilingConversion);
  window.world.layers[0].data = [];
  for (var i = 0; i < tilingMatrix.length; i++) {
    for (var j = 0; j < tilingMatrix[i].length; j++) {
      window.world.layers[0].data.push(tilingMatrix[i][j]);
    }
  }
  window.tilesize = this.gameView.config.tilesize;

  window.addEventListener("gameSceneCreated", ()=>
  {
    this.gameSceneCreated = true;
    this.onSceneCreation();
  });

  window.addEventListener("uiSceneCreated", ()=>
  {
    this.uiSceneCreated = true;
    this.onSceneCreation();
  });
};

ClientController.prototype.onSceneCreation = function()
{
  if(this.uiSceneCreated && this.gameSceneCreated)
  {
    this.initializeConnection();
  }
}

ClientController.prototype.initializeConnection = function ()
{
  
  // id of the socket that server gave to the connection
  this.socket.on("sendPlayer", function (player)
  {
    this.gameView.game.scene.getScene("uiScene").setDashboard(player);
    this.gameView.game.scene.getScene("uiScene").setInventory(player);
    this.gameView.game.scene.getScene("uiScene").setSocketId(player.socketId);
    this.gameView.game.scene.getScene("gameScene").setSocketId(player.socketId);
  }.bind(this));
  // We used  socket.on to listen for the  currentEntities event, and when this event is triggered,
  // the function we provided will be called with the  players object that we passed from our server.
  this.socket.on("currentEntities", function (entities)
  {
    //When this function is called,
    //we loop through each of the players and we check to see if that player’s id matches the current player’s socket id.
    for (var key in entities.players)
    {
      this.gameView.game.scene.getScene("uiScene").displayPortrait(entities.players[key]);
      this.gameView.game.scene.getScene("gameScene").buildAndDisplayEntity(entities.players[key]);
    }
    for (var key in entities.ias)
    {
      this.gameView.game.scene.getScene("gameScene").buildAndDisplayEntity(entities.ias[key]);
    }
  }.bind(this));

  this.socket.on("currentObjects", function (objects)
  {
    for(var key in objects)
    {
      this.gameView.game.scene.getScene("gameScene").buildAndDisplayObject(objects[key]);
    }
  }.bind(this));

  this.socket.on("update-inventory",function (player)
  {
    this.gameView.game.scene.getScene("uiScene").setInventory(player);
  }.bind(this));

  this.socket.on("newPlayer", function (playerInfo)
  {
    this.gameView.game.scene.getScene("uiScene").displayPortrait(playerInfo);
    this.gameView.game.scene.getScene("gameScene").buildAndDisplayEntity(playerInfo);
  }.bind(this));

  this.socket.on("alreadyLog", function (player_email)
  {
    alert("Account (" + player_email + ") already in use");
    window.location.replace("/index.html");
  });

  /*
  When the  entity-suppression event is fired, we take that player’s id and we remove that player’s ship from the game.
  We do this by calling the  getChildren() method on our  players group.
  The  getChildren() method will return an array of all the game objects that are in that group,
  and from there we use the  forEach() method to loop through that array.
  */
  this.socket.on("entity-suppression", function (info) 
  {
    switch (info.entityType) 
    {
      case "player":
        this.gameView.game.scene.getScene("gameScene").removePlayer(info.id);
        this.gameView.game.scene.getScene("uiScene").removePortrait(info.id);
        break;
        
      case "ia":
        this.gameView.game.scene.getScene("gameScene").removeIa(info.id);
        default:
        break;
    }
  }.bind(this));

  this.socket.on("object-suppression", function (info) 
  {
    this.gameView.game.scene.getScene("gameScene").removeObject(info.id);
  }.bind(this));

  this.socket.on("updateEntities", function (entities) 
  {
    this.gameView.game.scene.getScene("gameScene").upadteEntities(entities.players);
    this.gameView.game.scene.getScene("gameScene").upadteEntities(entities.ias);
    this.gameView.game.scene.getScene("uiScene").updatePlayers(entities.players);
  }.bind(this));

  this.socket.on("server-message", function (data) 
  {
    this.chatController.addChatAllElement(this.chatController.createMessageElement(data));
    this.chatController.addChatBattleLogsElement(this.chatController.createMessageElement(data));
  }.bind(this));

  this.socket.on("new-message", function (data) 
  {
    this.chatController.addChatAllElement(this.chatController.createMessageElement(data));
    this.chatController.addChatPartyElement(this.chatController.createMessageElement(data));
  }.bind(this));

  window.addEventListener("playerInput", function(e) 
  {
    this.socket.emit("playerInput", e.detail);
  }.bind(this));

  window.addEventListener("submit-chatline", function(e)
  {
    this.socket.emit("submit-chatline", e.detail);
  }.bind(this));

  this.socket.emit("onClientLoad");
  window.dispatchEvent(new CustomEvent("onClientLoad"));
};
