function ClientController() {
  this.uiSceneCreated = false;
  this.gameSceneCreated = false;
  this.socket = io();
  this.initialize();
}

ClientController.prototype.initialize = function ()
{
  this.socket.on("get-stage", this.initializeWorld.bind(this));
};

ClientController.prototype.initializeWorld = function (stage) 
{
  this.chatController = new ChatController();
  this.gameView = new GameView();
  window.typeMap = stage.map;
  window.dungeon = stage.dungeon;
  // We have to convert water (2) lava (3) abyss (4) to 2 cause AutoTiling only takes 2.
  let tileMatrixMap = JSON.parse(JSON.stringify(stage.map));
  for (let i = 0; i < tileMatrixMap.length; i++) 
  {
    for (let j = 0; j < tileMatrixMap[0].length; j++) 
    {
      if( tileMatrixMap[i][j] != 0 && tileMatrixMap[i][j] != 1)
      {
        tileMatrixMap[i][j] = 2; 
      } 
    }
  }  
  // auto tile the world 
  window.map = AutoTiling.tileMatrix(8, window.typeMap, this.gameView.config.autoTilingConversion);
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
    this.gameView.game.scene.getScene("uiScene").updateInventory(player);
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

  this.socket.on("new-object", function (object)
  {
    this.gameView.game.scene.getScene("gameScene").buildAndDisplayObject(object);
  }.bind(this));

  this.socket.on("update-inventory",function (player)
  {
    this.gameView.game.scene.getScene("uiScene").updateInventory(player);
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
        break;

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

  window.addEventListener("item-click", (e) =>
  {
    this.socket.emit("item-click",e.detail);
  });

  this.socket.emit("onClientLoad");
  window.dispatchEvent(new CustomEvent("onClientLoad"));
};
