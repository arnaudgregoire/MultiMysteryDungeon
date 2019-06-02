/*
Used to create all animation from spritesheets
*/
function createAnimations(phaserGame, pokedexIdx){
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
        phaserGame.anims.create({
            key: pokedexIdx + '_0_' + orientation,
           frames:  phaserGame.anims.generateFrameNames('sprites', {frames: [0,1,2], prefix: pokedexIdx + '_0_' + orientation + '_'}),
           frameRate: 4,
           repeat: -1 
        });
        // physical attack
        phaserGame.anims.create({
            key: pokedexIdx + '_1_' + orientation,
           frames:  phaserGame.anims.generateFrameNames('sprites', {frames: [0], prefix: pokedexIdx + '_1_' + orientation + '_'}),
           frameRate: 2,
           repeat: 0 
        });
        // special attack
        phaserGame.anims.create({
            key: pokedexIdx + '_2_' + orientation,
            frames:  phaserGame.anims.generateFrameNames('sprites', {frames: [0], prefix: pokedexIdx + '_2_' + orientation + '_'}),
            frameRate: 2,
            repeat: 0 
        });
        // hurt sprite
        phaserGame.anims.create({
            key: pokedexIdx + '_3_' + orientation,
            frames:  phaserGame.anims.generateFrameNames('sprites', {frames: [0], prefix: pokedexIdx + '_3_' + orientation + '_'}),
            frameRate: 2,
            repeat: 0 
        });
        // sleep sprite
        phaserGame.anims.create({
            key: pokedexIdx + '_4_' + orientation,
            frames:  phaserGame.anims.generateFrameNames('sprites', {frames: [0,1], prefix: pokedexIdx + '_4_' + orientation + '_'}),
            frameRate: 2,
            repeat: -1 
        });
        // idle sprite
        phaserGame.anims.create({
            key: pokedexIdx + '_5_' + orientation,
            frames:  phaserGame.anims.generateFrameNames('sprites', {frames: [0,1], prefix: pokedexIdx + '_0_' + orientation + '_'}),
            frameRate: 1,
            repeat: -1 
        });
    });
}