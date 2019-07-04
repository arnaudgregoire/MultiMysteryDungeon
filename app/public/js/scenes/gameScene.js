"use strict";
class GameScene extends Phaser.Scene{

    constructor(){
        super({ key: 'gameScene', active: true });
    }

    preload() {
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 1000, 50);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '50px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '50px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 100,
            text: 'Loading...',
            style: {
                font: '50px monospace',
                fill: '#ffffff'
            }
        });

        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 1000 * value, 30);
        });
                    
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
        
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        [1,2,3,4,6,7,83,142,144].forEach((number)=>{
            this.load.multiatlas(String(number), '../../assets/sprites/' + number + '/' + number + '.json');
        })
        this.load.image('tiles','../../assets/test_tileset.png');
        this.load.tilemapTiledJSON('map','../../assets/test_map.json');
    }

    create() {
        let self = this;
        // First, we created a new Phaser group which will be used to manage all of the player’s game objects on the client side.
        this.players = this.physics.add.group();
        this.texts = this.physics.add.group();
        this.map = this.make.tilemap({key:'map'});
        const tileset = this.map.addTilesetImage('test_tileset', 'tiles');
        const worldLayer = this.map.createStaticLayer('world', tileset, 0, 0);
        this.animationManager = new AnimationManager(self);
      
        /* 
        This will populate the cursors object with our four main Key objects (up, down, left, and right),
        which will bind to those arrows on the keyboard
        */
        this.cursors = this.input.keyboard.createCursorKeys();
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
        this.upKeyPressed = false;
        this.downKeyPressed = false;
      }

    update() {
        const left = this.leftKeyPressed;
        const right = this.rightKeyPressed;
        const up = this.upKeyPressed;
        const down = this.downKeyPressed;
        
        // Horizontal movement
        if (this.cursors.left.isDown){this.leftKeyPressed = true}
        else{this.leftKeyPressed = false}
        
        if (this.cursors.right.isDown){this.rightKeyPressed = true}
        else{this.rightKeyPressed = false}
        
        // Vertical movement
        if (this.cursors.up.isDown){this.upKeyPressed = true}
        else{this.upKeyPressed = false}
        
        if (this.cursors.down.isDown){this.downKeyPressed = true}
        else{this.downKeyPressed = false}  
        
        if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed || down != this.downKeyPressed) {
            window.dispatchEvent(
                new CustomEvent(
                    'playerInput',
                    {
                        detail: 
                        { 
                            left: this.leftKeyPressed,
                            right: this.rightKeyPressed,
                            up: this.upKeyPressed,
                            down: this.downKeyPressed
                        }
                    }
                )
            )
        }
    }
    /*
    Created our player by using the x and y coordinates that we generated in our server code.
    We used  setOrigin() to set the origin of the game object to be in the middle of the object instead of the top left.
    We stored the id so we can find the game object by that id later.
    Lastly, we added the player’s game object to the Phaser group we created.
    */
    displayPlayers(playerInfo) {
        let self = this;
        const player = self.add.sprite(playerInfo.x, playerInfo.y, 'sprites', playerInfo.pokemon.gameIndex + '_0_0_0').setOrigin(0.5, 0.5);
        player.userId = playerInfo.userId;
        player.orientation = playerInfo.orientation;
        player.action = playerInfo.action;
        player.socketId = playerInfo.socketId;
        player.name = playerInfo.name;
        player.pokemon = playerInfo.pokemon;
        var text = self.add.text(
            playerInfo.x,
            playerInfo.y,
            playerInfo.name, {
                fontSize: '15px',
                fontFamily: 'Verdana',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5,1.6);
        text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 0);
        text.userId = playerInfo.userId;
        self.displayPlayer(player);
        if(player.socketId == self.socketId){
            //we set the camera on the player hero
            self.setCamera(player);
        }
        self.players.add(player);
        self.texts.add(text);
    }

    removePlayer(userId){
        let self = this;
        self.players.getChildren().forEach(function (player) {
            if (userId === player.userId) {
            player.destroy();
            }
        });
        self.texts.getChildren().forEach(function (player) {
            if (userId === player.userId) {
            player.destroy();
            }
        });
    }

    /*
    Display one player animation, by playing his new animation. Only called if something (orientation or action) changed server side
    If the animation has not been used before, the animation is created
    */
    displayPlayer(player){
        let self = this;
        // We get the key corresponding of the sprite animation for example a bulbasaur moving left will be 1_0_2
        var spriteKey = self.getSpriteKey(player);
        // if sprite not already loaded, we create it
        if(!self.anims.exists(spriteKey)){
            self.animationManager.createAnimations(player.pokemon.gameIndex);
        }
        // We play the new correct animation
        self.playAnimation(player, spriteKey);
    }

    /*
    Set the camera on the pokemon that player is controlling
    */
    setCamera(hero){
        let self = this;
        //console.log("setting camera");
        // Phaser supports multiple cameras, but you can access the default camera like this:
        const camera = self.cameras.main;
        camera.startFollow(hero);
        camera.setBounds(0, 0, self.map.widthInPixels, self.map.heightInPixels);
        camera.zoom = 3;
    }

    /**
     * Get the sprite key corresponding to player orientation and action
     * for example a squirtle moving down will be 7_0_0
     */
    getSpriteKey(player) {
        const orientationTable = {
        "down": 0,
        "downleft": 1,
        "left": 2,
        "upleft": 3,
        "up": 4,
        "upright": 3,
        "right": 2,
        "downright":1
        };
        var key = "";
        key += player.pokemon.gameIndex;
        key += "_";
        key += player.action;
        key += "_";
        key += orientationTable[player.orientation];
        return key;
    }

    /*
    Change the animation on phaser
    change the flipX value to, cause we only load down, left, upleft and downleft sprites and then flip them for right etc ...
    */
    playAnimation(player, spriteKey){
        var flipxTable = {"down":false, "downleft":false, "left":false, "upleft":false, "up":false, "upright":true, "right":true, "downright":true};
        player.flipX = flipxTable[player.orientation];
        player.anims.play(spriteKey);
    }

    updatePlayers(players){
        let self = this;
        Object.keys(players).forEach(function (index) {
            self.players.getChildren().forEach(function (player) {
            if (players[index].userId === player.userId) {
                player.setPosition(players[index].x, players[index].y);
                //if the actual animation sprite currently played client side is different from the server one,
                // the client start to play and save the new sprite
                if(player.orientation != players[index].orientation
                || player.action != players[index].action){
                    player.action = players[index].action;
                    player.orientation = players[index].orientation;
                    self.displayPlayer(player);
                }
            }
            });
            self.texts.getChildren().forEach(function (player) {
                if (players[index].userId === player.userId) {
                    player.setPosition(players[index].x, players[index].y);
                }
            })
        });
    }
    
    setSocketId(id){
        this.socketId = id;
    }
}
 