/*
Used to create all animation from spritesheets
*/
class AnimationManager{

    constructor(game){
        this.game = game;
    }

    createAnimations(gameIndex){
        let self = this;
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
            self.game.anims.create({
                key: gameIndex + '_0_' + orientation,
               frames:  self.game.anims.generateFrameNames(gameIndex, {frames: [0,1,2], prefix: gameIndex + '_0_' + orientation + '_'}),
               frameRate: 10,
               repeat: -1 
            });
            // physical attack
            self.game.anims.create({
                key: gameIndex + '_1_' + orientation,
               frames:  self.game.anims.generateFrameNames(gameIndex, {frames: [0,1,2], prefix: gameIndex + '_1_' + orientation + '_'}),
               frameRate: 5,
               repeat: 0 
            });
            // special attack
            self.game.anims.create({
                key: gameIndex + '_2_' + orientation,
                frames:  self.game.anims.generateFrameNames(gameIndex, {frames: [0], prefix: gameIndex + '_2_' + orientation + '_'}),
                frameRate: 2,
                repeat: 0 
            });
            // hurt sprite
            self.game.anims.create({
                key: gameIndex + '_3_' + orientation,
                frames:  self.game.anims.generateFrameNames(gameIndex, {frames: [0], prefix: gameIndex + '_3_' + orientation + '_'}),
                frameRate: 2,
                repeat: 0 
            });
            // sleep sprite
            self.game.anims.create({
                key: gameIndex + '_4_' + orientation,
                frames:  self.game.anims.generateFrameNames(gameIndex, {frames: [0,1], prefix: gameIndex + '_4_' + orientation + '_'}),
                frameRate: 2,
                repeat: -1 
            });
            // idle sprite
            self.game.anims.create({
                key: gameIndex + '_5_' + orientation,
                frames:  self.game.anims.generateFrameNames(gameIndex, {frames: [0,2], prefix: gameIndex + '_0_' + orientation + '_'}),
                frameRate: 2,
                repeat: -1 
            });
        });
    }
}
