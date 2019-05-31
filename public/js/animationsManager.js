/*
Used to create all animation from spritesheets
*/
function createAnimations(phaser_game, pokedex_idx){
    //for each orientation
    /*
    0 : down
    1 : down left
    2 : left
    3 : up left
    4 : up
    */
    ['0','1','2','3','4'].forEach(orientation => {
        //moving sprites
        phaser_game.anims.create({
            key: pokedex_idx + '_0_' + orientation,
           frames:  phaser_game.anims.generateFrameNames('sprites', {frames: [0,1,2], prefix: pokedex_idx + '_0_' + orientation + '_'}),
           frameRate: 4,
           repeat: -1 
        });
        // physical attack
        phaser_game.anims.create({
            key: pokedex_idx + '_1_' + orientation,
           frames:  phaser_game.anims.generateFrameNames('sprites', {frames: [0], prefix: pokedex_idx + '_1_' + orientation + '_'}),
           frameRate: 2,
           repeat: 0 
        });
        // special attack
        phaser_game.anims.create({
            key: pokedex_idx + '_2_' + orientation,
            frames:  phaser_game.anims.generateFrameNames('sprites', {frames: [0], prefix: pokedex_idx + '_2_' + orientation + '_'}),
            frameRate: 2,
            repeat: 0 
        });
        // hurt sprite
        phaser_game.anims.create({
            key: pokedex_idx + '_3_' + orientation,
            frames:  phaser_game.anims.generateFrameNames('sprites', {frames: [0], prefix: pokedex_idx + '_3_' + orientation + '_'}),
            frameRate: 2,
            repeat: 0 
        });
        // sleep sprite
        phaser_game.anims.create({
            key: pokedex_idx + '_4_' + orientation,
            frames:  phaser_game.anims.generateFrameNames('sprites', {frames: [0,1], prefix: pokedex_idx + '_4_' + orientation + '_'}),
            frameRate: 2,
            repeat: -1 
        });
        // idle sprite
        phaser_game.anims.create({
            key: pokedex_idx + '_5_' + orientation,
            frames:  phaser_game.anims.generateFrameNames('sprites', {frames: [0,1], prefix: pokedex_idx + '_0_' + orientation + '_'}),
            frameRate: 1,
            repeat: -1 
        });
    });
}