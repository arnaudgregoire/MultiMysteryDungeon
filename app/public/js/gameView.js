class GameView{

  constructor(config){
    this.config = config;
    this.game = new Phaser.Game(this.config);
  }

  static getDefaultConfig(){
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
      scene: [GameScene, UIScene],
      scale:{
        mode: Phaser.Scale.FIT
      },
      tilesize: 24,
      autoTilingConversion:
        {
        0: 61,
        1: {
        "A": 49,
        "B": 42,
        "C": 37,
        "D": 44,
        "AB": 30,
        "AC": 24,
        "AD": 32,
        "BC": 18,
        "BD": 19,
        "CD": 20,
        "ABC": 60,
        "ABD": 67,
        "ACD": 62,
        "BCD": 55,
        "ABCD": 43,
        "A1B": 12,
        "B2C": 0,
        "C3D": 2,
        "AD4": 14,
        "A1BC": 102,
        "AB2C": 108,
        "B2CD": 115,
        "BC3D": 114,
        "AC3D": 109,
        "ACD4": 103,
        "A1BD": 121,
        "ABD4": 120,
        "A1B2C": 6,
        "B2C3D": 1,
        "AC3D4": 8,
        "A1BD4": 13,
        "A1BCD": 132,
        "AB2CD": 126,
        "ABC3D": 127,
        "ABCD4": 133,
        "A1B2CD": 80,
        "AB2C3D": 85,
        "ABC3D4": 78,
        "A1BCD4": 73,
        "A1B2C3D": 97,
        "AB2C3D4": 96,
        "A1BC3D4": 90,
        "A1B2CD4": 91,
        "A1BC3D": 138,
        "AB2CD4": 139,
        "A1B2C3D4": 7,
        "X": 25
        },
        2: {
        "A": 52,
        "B": 45,
        "C": 40,
        "D": 47,
        "AB": 33,
        "AC": 27,
        "AD": 35,
        "BC": 21,
        "BD": 22,
        "CD": 23,
        "ABC": 63,
        "ABD": 70,
        "ACD": 65,
        "BCD": 58,
        "ABCD": 46,
        "A1B": 15,
        "B2C": 3,
        "C3D": 5,
        "AD4": 17,
        "A1BC": 105,
        "AB2C": 111,
        "B2CD": 118,
        "BC3D": 117,
        "AC3D": 112,
        "ACD4": 106,
        "A1BD": 124,
        "ABD4": 123,
        "A1B2C": 9,
        "B2C3D": 4,
        "AC3D4": 11,
        "A1BD4": 16,
        "A1BCD": 135,
        "AB2CD": 129,
        "ABC3D": 130,
        "ABCD4": 136,
        "A1B2CD": 83,
        "AB2C3D": 88,
        "ABC3D4": 81,
        "A1BCD4": 76,
        "A1B2C3D": 100,
        "AB2C3D4": 99,
        "A1BC3D4": 93,
        "A1B2CD4": 94,
        "A1BC3D": 141,
        "AB2CD4": 142,
        "A1B2C3D4": 10,
        "X": 28
        }
      }
    }
  }
}