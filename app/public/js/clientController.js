class ClientController{
    
    constructor(){
        this.socket = io();
        this.initialize();
    }

    initialize(){
        let self = this;
        this.socket.on('get-world',function(world){
            window.world = world;
            let config = GameView.getDefaultConfig();
            for (let i = 0; i < window.world.layers[0].data.length; i++) {
                for (let j = 0; j < window.world.layers[0].data[0].length; j++) {
                    if(window.world.layers[0].data[i][j] == 0){
                        window.world.layers[0].data[i][j] = 1;
                    }
                    else if(window.world.layers[0].data[i][j] == 1){
                        window.world.layers[0].data[i][j] =0;
                    }
                }
            }
            window.world.layers[0].data = AutoTiling.tileMatrix(8, window.world.layers[0].data, config.autoTilingConversion);
            window.tilesize = config.tilesize;
            self.gameView = new GameView(config);
            self.chatController = new ChatController();
            window.addEventListener('gameSceneCreated',self.initializeConnection.bind(self));
        })
    }

    initializeConnection(){
        let self = this;
        // id of the socket that server gave to the connection
        this.socket.on('sendPlayer', function (player) {
            self.gameView.game.scene.getScene('uiScene').setDashboard(player);
            self.gameView.game.scene.getScene('uiScene').setSocketId(player.socketId);
            self.gameView.game.scene.getScene('gameScene').setSocketId(player.socketId);
        })
        // We used  socket.on to listen for the  currentEntities event, and when this event is triggered,
        // the function we provided will be called with the  players object that we passed from our server.
        this.socket.on('currentEntities', function (entities) {
            //When this function is called,
            //we loop through each of the players and we check to see if that player’s id matches the current player’s socket id.
            Object.keys(entities.players).forEach(function (id) {
                self.gameView.game.scene.getScene('uiScene').displayPortrait(entities.players[id]);
                self.gameView.game.scene.getScene('gameScene').displayEntities(entities.players[id]);
            });
            Object.keys(entities.ias).forEach(function (id) {
                self.gameView.game.scene.getScene('gameScene').displayEntities(entities.ias[id]);
            });
        });
        
        this.socket.on('newPlayer', function (playerInfo) {
            self.gameView.game.scene.getScene('uiScene').displayPortrait(playerInfo);
            self.gameView.game.scene.getScene('gameScene').displayEntities(playerInfo);
        });
    
        this.socket.on('alreadyLog', function (player_email) {
            alert("Account (" + player_email + ") already in use");
            window.location.replace('/index.html');
        });
        
        /*
        When the  entity-suppression event is fired, we take that player’s id and we remove that player’s ship from the game.
        We do this by calling the  getChildren() method on our  players group.
        The  getChildren() method will return an array of all the game objects that are in that group,
        and from there we use the  forEach() method to loop through that array.
        */
        this.socket.on('entity-suppression', function (info) {
            let id = info.id;
            let entityType = info.entityType;
            switch (entityType) {
                case 'player':
                    self.gameView.game.scene.getScene('gameScene').removePlayer(id);
                    self.gameView.game.scene.getScene('uiScene').removePortrait(id);
                    break;
                case 'ia':
                        self.gameView.game.scene.getScene('gameScene').removeIa(id);
                default:
                    break;
            }

        });
    
        this.socket.on('updateEntities', function (entities) {
            self.gameView.game.scene.getScene('gameScene').upadteEntities(entities.players);
            self.gameView.game.scene.getScene('gameScene').upadteEntities(entities.ias);
            self.gameView.game.scene.getScene('uiScene').updatePlayers(entities.players);
        });

        this.socket.on('server-message', function (data){
            self.chatController.addChatAllElement(self.chatController.createMessageElement(data));
            self.chatController.addChatBattleLogsElement(self.chatController.createMessageElement(data));
        })
        
        this.socket.on('new-message', (data) => {
            self.chatController.addChatAllElement(self.chatController.createMessageElement(data));
            self.chatController.addChatPartyElement(self.chatController.createMessageElement(data));
        });

        window.addEventListener('playerInput',function(e){
            self.socket.emit('playerInput',e.detail);
        });

        window.addEventListener('submit-chatline',function(e){
            self.socket.emit('submit-chatline', e.detail);
        })
        self.socket.emit('onClientLoad');
        window.dispatchEvent(new CustomEvent('onClientLoad'));
    }
}