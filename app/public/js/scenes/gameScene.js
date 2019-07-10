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

        [1,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,83,142,144].forEach((number)=>{
            this.load.multiatlas(String(number), '../../assets/sprites/' + number + '/' + number + '.json');
        })
        this.load.image('tiles','../../assets/tileset.png');
    }

    create() {
        let self = this;
        // First, we created a new Phaser group which will be used to manage all of the player’s game objects on the client side.
        this.players = this.add.group();
        this.ias = this.add.group();
        this.map = this.make.tilemap({ data: window.map, tileWidth: window.tilesize, tileHeight:window.tilesize});
        const tileset = this.map.addTilesetImage('tiles','tiles',window.tilesize,window.tilesize,0,1,0);
        const worldLayer = this.map.createStaticLayer(0, tileset, 0, 0);
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
    Created our entity by using the x and y coordinates that we generated in our server code.
    We used  setOrigin() to set the origin of the game object to be in the middle of the object instead of the top left.
    We stored the id so we can find the game object by that id later.
    Lastly, we added the entity game object to the Phaser group we created.
    */
    displayEntities(entityInfo) {
        let self = this;
        let entity = self.add.sprite(entityInfo.x * window.tilesize, entityInfo.y * window.tilesize).setOrigin(0,0.3);
        entity.entityType = entityInfo.entityType;
        entity.orientation = entityInfo.orientation;
        entity.action = entityInfo.action;
        entity.name = entityInfo.name;
        entity.pokemon = entityInfo.pokemon;
        
        if(entityInfo.entityType == 'player'){
            entity.userId = entityInfo.userId;
            entity.socketId = entityInfo.socketId;
        }
        else if(entityInfo.entityType == 'ia'){
            entity.uniqid = entityInfo.uniqid;
        }

        //we set the camera on the entity hero
        if(entity.entityType == 'player'){

            if(entity.socketId == self.socketId){
                self.setCamera(entity);
            }
            self.players.add(entity);
        }

        else if(entity.entityType == 'ia'){
            self.ias.add(entity);
        }

        self.displayEntity(entity);
    }

    removePlayer(id){
        let self = this;
        self.players.getChildren().forEach(function (entity) {
            if (id === entity.userId) {
                entity.destroy();
            }
        });
    }

    /*
    Display one entity animation, by playing his new animation. Only called if something (orientation or action) changed server side
    If the animation has not been used before, the animation is created
    */
    displayEntity(entity){
        let self = this;
        // We get the key corresponding of the sprite animation for example a bulbasaur moving left will be 1_0_2
        var spriteKey = self.getSpriteKey(entity);
        // if sprite not already loaded, we create it
        if(!self.anims.exists(spriteKey)){
            self.animationManager.createAnimations(entity.pokemon.gameIndex);
        }
        // We play the new correct animation
        self.playAnimation(entity, spriteKey);
    }

    /*
    Set the camera on the pokemon that entity is controlling
    */
    setCamera(hero){
        let self = this;
        //console.log("setting camera");
        // Phaser supports multiple cameras, but you can access the default camera like this:
        const camera = self.cameras.main;
        camera.startFollow(hero);
        camera.setBounds(0, 0, self.map.widthInPixels, self.map.heightInPixels);
        camera.zoom = 2;
    }

    /**
     * Get the sprite key corresponding to entity orientation and action
     * for example a squirtle moving down will be 7_0_0
     */
    getSpriteKey(entity) {
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
        key += entity.pokemon.gameIndex;
        key += "_";
        key += entity.action;
        key += "_";
        key += orientationTable[entity.orientation];
        return key;
    }

    /*
    Change the animation on phaser
    change the flipX value to, cause we only load down, left, upleft and downleft sprites and then flip them for right etc ...
    */
    playAnimation(entity, spriteKey){
        var flipxTable = {"down":false, "downleft":false, "left":false, "upleft":false, "up":false, "upright":true, "right":true, "downright":true};
        entity.flipX = flipxTable[entity.orientation];
        entity.anims.play(spriteKey);
    }

    upadteEntities(entities){
        let self = this;
        if(entities != []){
            if(entities[0].entityType == 'player'){
                Object.keys(entities).forEach(function (index) {
                    self.players.getChildren().forEach(function (player) {
                    if (entities[index].userId === player.userId) {
                        player.setPosition(entities[index].x * window.tilesize, entities[index].y * window.tilesize);
                        //if the actual animation sprite currently played client side is different from the server one,
                        // the client start to play and save the new sprite
                        if(player.orientation != entities[index].orientation
                        || player.action != entities[index].action){
                            player.action = entities[index].action;
                            player.orientation = entities[index].orientation;
                            self.displayEntity(player);
                        }
                    }
                    });
                });
            }
            else if (entities[0].entityType == 'ia'){
                Object.keys(entities).forEach(function (index) {
                    self.ias.getChildren().forEach(function (ia) {
                    if (entities[index].uniqid === ia.uniqid) {
                        ia.setPosition(entities[index].x * window.tilesize, entities[index].y * window.tilesize);
                        //if the actual animation sprite currently played client side is different from the server one,
                        // the client start to play and save the new sprite
                        if(ia.orientation != entities[index].orientation
                        || ia.action != entities[index].action){
                            ia.action = entities[index].action;
                            ia.orientation = entities[index].orientation;
                            self.displayEntity(ia);
                        }
                    }
                    });
                });
            }
        }

    }
    
    setSocketId(id){
        this.socketId = id;
    }
}
 