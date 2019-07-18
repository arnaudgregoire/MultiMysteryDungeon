"use strict";
class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'uiScene', active: true });
        this.rectangleGeometry = new Phaser.Geom.Rectangle(0,0,140,140);
        this.healthBarLength = 150;
        this.maxHealthBarGeometry = new Phaser.Geom.Rectangle(0,0,this.healthBarLength,20);
        this.healthBarGeometry = new Phaser.Geom.Rectangle(0,0,this.healthBarLength,20);
    }

    preload(){
        this.load.multiatlas('portraits','../../assets/pokemonPortraits.json');
        this.load.multiatlas('typeIcons', '../../assets/typeIcons.json');
        this.load.image('dashboard','../../assets/ui/dashboard.png' );
    }

    create(){
        this.textStyle = 
        {
            fontSize: '30px',
            fontFamily: 'Verdana',
            color: 'white',
            align: 'center'
        };
        this.portraits = this.add.container(70,70);
        this.add.image(800,900,'dashboard');
        window.dispatchEvent(new CustomEvent('gameSceneCreated'));
    }

    setDashboard(player){
        console.log(player);
        
        this.dashboardPortrait = this.add.sprite(100,900,'portraits','portrait' + player.pokemon.gameIndex).setScale(3,3);
        this.dashboardName = this.add.text(200,830,player.name,this.textStyle);
        this.dashboardPokemonName = this.add.text(200,870,player.pokemon.name, this.textStyle);
        this.dashboardLevel = this.add.text(200,910, 'Lvl ' + player.pokemon.level, this.textStyle);
        this.types = [];
        for (let i = 0; i < player.pokemon.types.length; i++) {
            this.types.push(this.add.sprite(
                420,
                850 + 50 * i,
                'typeIcons',
                player.pokemon.types[i].type.name
            ))
        }
        this.healthBarBackground = this.add.graphics(
            {
                x:480,
                y:835,
                fillStyle:{
                    color: 0xff0000
                },
                add:true
            }
        )
        this.healthBar = this.add.graphics(
            {
                x:480,
                y:835,
                fillStyle:{
                    color: 0x32CD32
                },
                add:true
            }
        )

        this.health = this.add.text(480,860,player.pokemon.health + " / "+ player.pokemon.stats[5].value + " HP", this.textStyle);
        this.setHealth(player);
        
    }
    
    setHealth(player){
        this.healthBarBackground.fillRectShape(this.maxHealthBarGeometry);
        this.healthBarGeometry.setSize(Math.round(this.healthBarLength * player.pokemon.health/player.pokemon.stats[5].value),20);
        this.healthBar.fillRectShape(this.healthBarGeometry);
    }

    displayPortrait(playerInfo){
        let self = this;
        let portrait = self.add.container(0, 180 * self.portraits.length);
        portrait.userId = playerInfo.userId;

        let sprite = self.add.sprite(
            0,
            0,
            'portraits',
            'portrait' + playerInfo.pokemon.gameIndex);
        sprite.setScale(3,3);

        let text = self.add.text(-70,70,playerInfo.name,self.textStyle);
        let rectangle = self.add.graphics(
            {
            x:-69,
            y:-70,
            fillStyle: {
                 color: 0x00C100,
                 alpha: 1
            },
            add:true
        });

        let types = [];

        rectangle.fillRectShape(self.rectangleGeometry);
        portrait.add(rectangle);
        portrait.add(sprite);
        portrait.add(text);
        types.forEach(type=>{
            portrait.add(type);
        });
        self.portraits.add(portrait);
    }


    removePortrait(userId){
        let self = this;
        self.portraits.remove(self.portraits.getFirst('userId',userId));
        self.portraits.iterate(function(portrait){
            portrait.setPosition(0, 180  * self.portraits.getIndex(portrait));
        },self);
    }

    updatePlayers(players){
        let self = this;
        let rectStyle = {'false': 0xDC143C, 'true': 0x00C100};
        Object.keys(players).forEach(function (index) {
            self.portraits.iterate((portrait)=>{
                if(portrait.userId == players[index].userId){
                    let graphic = portrait.getFirst();
                    graphic.fillStyle(rectStyle[players[index].turnPlayed],1);
                    graphic.fillRectShape(self.rectangleGeometry);
                }
            },self);
        });
    }
}