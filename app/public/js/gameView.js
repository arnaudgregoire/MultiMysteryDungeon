class GameView{

  constructor(){
    this.config = this.getDefaultConfig();
    this.game = new Phaser.Game(this.config);
  }

  getDefaultConfig(){
    return {
        type: Phaser.AUTO,
        parent: 'content',
        width: 1600,
        height: 1000,
        pixelArt: true,
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
            gravity: { y: 0 }
          }
        },
        scene: [GameScene],
        scale:{
          mode: Phaser.Scale.FIT
        }
    }
  }
}