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

        this.redTextStyle = 
        {
            fontSize: '30px',
            fontFamily: 'Verdana',
            color: 'red',
            align: 'center'
        };
        this.greenTextStyle = 
        {
            fontSize: '30px',
            fontFamily: 'Verdana',
            color: 'lightgreen',
            align: 'center'
        }
        this.portraits = this.add.container(70,70);
        this.add.image(800,900,'dashboard');
        window.dispatchEvent(new CustomEvent('gameSceneCreated'));
    }

    setDashboard(player){
        this.dashboardPortrait = this.add.sprite(100,900,'portraits','portrait' + player.pokemon.gameIndex).setScale(3,3);
        this.dashboardName = this.add.text(200,830,player.name,this.textStyle);
        this.dashboardPokemonName = this.add.text(200,870,player.pokemon.name, this.textStyle);
        this.dashboardLevel = this.add.text(200,910, 'Lvl ' + player.pokemon.level, this.textStyle);
        this.gender = this.add.text(200, 950, player.pokemon.gender, this.textStyle);
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

        this.health = this.add.text(480, 860, player.pokemon.health + " / "+ player.pokemon.stats[5].value + " HP", this.textStyle);
        this.healthBarBackground.fillRectShape(this.maxHealthBarGeometry);
        this.setHealth(player);

        this.ability = this.add.text(385, 920, 'Talent  : ' + player.pokemon.ability.name, this.textStyle);
        this.nature = this.add.text(385,960, 'Nature : ' + player.pokemon.nature, this.textStyle);

        this.hp = this.add.text(700, 830, 'Hp  : ' + player.pokemon.stats[5].value, this.textStyle);
        this.atk = this.add.text(700, 860, 'Atk : ' + player.pokemon.stats[4].value, this.textStyle);
        this.def = this.add.text(700, 890, 'Def : ' + player.pokemon.stats[3].value, this.textStyle);
        this.spa = this.add.text(700, 920, 'Spa : ' + player.pokemon.stats[2].value, this.textStyle);
        this.spd = this.add.text(700, 950, 'Spd : ' + player.pokemon.stats[1].value, this.textStyle);

        this.ivHp = this.add.text(830, 830, '(' + player.pokemon.ivs[5].value + ')', this.redTextStyle);
        this.ivAtk = this.add.text(830, 860, '(' + player.pokemon.ivs[4].value + ')', this.redTextStyle);
        this.ivDef = this.add.text(830, 890, '(' + player.pokemon.ivs[3].value + ')', this.redTextStyle);
        this.ivSpa = this.add.text(830, 920, '(' + player.pokemon.ivs[2].value + ')', this.redTextStyle);
        this.ivSpd = this.add.text(830, 950, '(' + player.pokemon.ivs[1].value + ')', this.redTextStyle);

        this.evHp = this.add.text(900, 830, '(' + player.pokemon.evs[5].value + ')', this.greenTextStyle);
        this.evAtk = this.add.text(900, 860, '(' + player.pokemon.evs[4].value + ')', this.greenTextStyle);
        this.evDef = this.add.text(900, 890, '(' + player.pokemon.evs[3].value + ')', this.greenTextStyle);
        this.evSpa = this.add.text(900, 920, '(' + player.pokemon.evs[2].value + ')', this.greenTextStyle);
        this.evSpd = this.add.text(900, 950, '(' + player.pokemon.evs[1].value + ')', this.greenTextStyle);
    }
    
    setHealth(player){
        this.healthBarGeometry.setSize(Math.round(this.healthBarLength * player.pokemon.health/player.pokemon.stats[5].value),20);
        this.healthBar.clear();
        this.healthBar.fillRectShape(this.healthBarGeometry);
        this.health.setText(player.pokemon.health + " / "+ player.pokemon.stats[5].value);
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
            if(players[index].socketId == self.socketId){
                self.setHealth(players[index]);
            }
            self.portraits.iterate((portrait)=>{
                if(portrait.userId == players[index].userId){
                    let graphic = portrait.getFirst();
                    graphic.fillStyle(rectStyle[players[index].turnPlayed],1);
                    graphic.fillRectShape(self.rectangleGeometry);
                }
            },self);
        });
    }

    setSocketId(id){
        this.socketId = id;
    }
}