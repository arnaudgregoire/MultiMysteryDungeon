"use strict";
class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'uiScene', active: true });
    }

    preload(){
        this.load.multiatlas('portraits','../../assets/pokemonPortraits.json');
    }

    create(){
        this.portraits = this.add.group();
        window.dispatchEvent(new CustomEvent('gameSceneCreated'));
    }

    displayPortrait(playerInfo){
        let portrait = this.add.sprite(
            65,
            130 * this.portraits.getLength() + 65,
            'portraits',
            'portrait' + playerInfo.pokedexIdx);
        portrait.setScale(3,3);
        portrait.id = playerInfo.id;
        this.portraits.add(portrait);
    }


    removePortrait(id){
        let self = this;
        self.portraits.getChildren().forEach(function (portrait) {
            if (id === portrait.id) {
             portrait.destroy();
            }
        });
        let index = 0;
        self.portraits.getChildren().forEach(function (portrait){
            portrait.setPosition(65, 130 * index + 65);
            index += 1;
        })
    }
}