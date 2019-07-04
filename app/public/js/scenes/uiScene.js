"use strict";
class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'uiScene', active: true });
        this.rectangleGeometry = new Phaser.Geom.Rectangle(0,0,140,140);
    }

    preload(){
        this.load.multiatlas('portraits','../../assets/pokemonPortraits.json');
    }

    create(){
        this.portraits = this.add.container(70,70);
        window.dispatchEvent(new CustomEvent('gameSceneCreated'));
    }

    displayPortrait(playerInfo){
        let self = this;
        let portrait = self.add.container(0, 180 * self.portraits.length);
        portrait.userId = playerInfo.userId;

        let sprite = self.add.sprite(
            0,
            0,
            'portraits',
            'portrait' + playerInfo.pokedexIdx);
        sprite.setScale(3,3);

        let text = self.add.text(-70,70,playerInfo.name,{
            fontSize: '30px',
            fontFamily: 'Verdana',
            color: 'black',
            align: 'center',
            backgroundColor:'white'
        });
        let rectangle = self.add.graphics(
            {
            x:-69,
            y:-70,
            fillStyle: {
                 color: 0x00C100,
                 alpha: 1
            },
            add:true
        })
        rectangle.fillRectShape(self.rectangleGeometry);
        portrait.add(rectangle);
        portrait.add(sprite);
        portrait.add(text);
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