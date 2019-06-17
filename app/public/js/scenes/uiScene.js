"use strict";
class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'uiScene', active: true });
    }

    preload(){
        this.load.multiatlas('portraits','../../assets/pokemonPortraits.json');
    }

    create(){
        this.portraits = this.add.container(65,65);
        window.dispatchEvent(new CustomEvent('gameSceneCreated'));
    }

    displayPortrait(playerInfo){
        let self = this;
        let portrait = self.add.container(0, 160 * self.portraits.length);
        portrait.id = playerInfo.id;

        let sprite = self.add.sprite(
            0,
            0,
            'portraits',
            'portrait' + playerInfo.pokedexIdx);
        sprite.setScale(3,3);

        let text = self.add.text(-60,60,playerInfo.name,{
            fontSize: '30px',
            fontFamily: 'Verdana',
            color: 'black',
            align: 'center',
            backgroundColor:'white'
        });
        portrait.add(sprite);
        portrait.add(text);
        self.portraits.add(portrait);
    }


    removePortrait(id){
        let self = this;
        self.portraits.remove(self.portraits.getFirst('id',id));
        self.portraits.iterate(function(portrait){
            portrait.setPosition(0, 160 * self.portraits.getIndex(portrait));
        },self);
    }
}