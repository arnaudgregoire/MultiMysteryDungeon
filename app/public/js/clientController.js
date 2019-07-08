class ClientController{
    
    constructor(){
        this.socket = io();
        this.initialize();
    }

    initialize(){
        let self = this;
        this.socket.on('getMap',function(map){
            window.map = map;
            let config = GameView.getDefaultConfig();
            window.tilesize = config.tilesize;
            self.gameView = new GameView(config);
            self.chatController = new ChatController();
            window.addEventListener('gameSceneCreated',self.initializeConnection.bind(self));
        })
    }

    initializeConnection(){
        let self = this;
        // id of the socket that server gave to the connection
        this.socket.on('sendId', function (socketId) {
            self.gameView.game.scene.getScene('gameScene').setSocketId(socketId);
        })
        // We used  socket.on to listen for the  currentPlayers event, and when this event is triggered,
        // the function we provided will be called with the  players object that we passed from our server.
        this.socket.on('currentPlayers', function (players) {
            //When this function is called,
            //we loop through each of the players and we check to see if that player’s id matches the current player’s socket id.
            Object.keys(players).forEach(function (id) {
                self.gameView.game.scene.getScene('uiScene').displayPortrait(players[id]);
                self.gameView.game.scene.getScene('gameScene').displayPlayers(players[id]);
            });
        });
        
        this.socket.on('newPlayer', function (playerInfo) {
            self.gameView.game.scene.getScene('uiScene').displayPortrait(playerInfo);
            self.gameView.game.scene.getScene('gameScene').displayPlayers(playerInfo);
        });
    
        this.socket.on('alreadyLog', function (player_email) {
            alert("Account (" + player_email + ") already in use");
            window.location.replace('/index.html');
        });
        
        /*
        When the  disconnect event is fired, we take that player’s id and we remove that player’s ship from the game.
        We do this by calling the  getChildren() method on our  players group.
        The  getChildren() method will return an array of all the game objects that are in that group,
        and from there we use the  forEach() method to loop through that array.
        */
        this.socket.on('disconnect', function (id) {
            self.gameView.game.scene.getScene('gameScene').removePlayer(id);
            self.gameView.game.scene.getScene('uiScene').removePortrait(id);
        });
    
        this.socket.on('playerUpdates', function (players) {
            self.gameView.game.scene.getScene('gameScene').updatePlayers(players);
            self.gameView.game.scene.getScene('uiScene').updatePlayers(players);
        });

        this.socket.on('turnUpdate', function (data){
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