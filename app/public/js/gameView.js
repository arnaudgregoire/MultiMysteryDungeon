function GameView(config) {
  this.setDefaultConfig();
  Utils.assign(this.config, config);
  this.game = new Phaser.Game(this.config);
}

GameView.prototype.setDefaultConfig = function () {
  this.config = {
    type: Phaser.AUTO,
    parent: "content",
    width: 1600, height: 1000,
    pixelArt: true,
    physics: {
      default: "arcade",
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
    autoTilingConversion: {
      0: {
        "A": 74,v"B": 64,v"C": 56, "D": 66,
        "AB": 46, "AC": 37, "AD": 48, "BC": 28, "BD": 29, "CD": 30,
        "ABC": 91, "ABD": 101, "ACD": 93, "BCD": 83,
        "ABCD": 65,
        "A1B": 19, "B2C": 1, "C3D": 3, "AD4": 21,
        "A1B2C": 10, "B2C3D": 2, "AC3D4": 12, "A1BD4": 20,
        "A1BC": 154, "AB2C": 163, "B2CD": 173, "BC3D": 172,
        "AC3D": 164, "ACD4": 155, "A1BD": 182, "ABD4": 181,
        "A1BCD": 199, "AB2CD": 190,
        "ABC3D": 191, "ABCD4": 200,
        "A1B2CD": 120, "AB2C3D": 128,
        "ABC3D4": 118, "A1BCD4": 110,
        "A1B2C3D": 146, "AB2C3D4": 145,
        "A1BC3D4": 136, "A1B2CD4": 137,
        "A1BC3D": 208, "AB2CD4": 209,
        "A1B2C3D4": 11,
        "X": 38
      },
      1: {
        "A": 77, "B": 67, "C": 59, "D": 69,
        "AB": 49, "AC": 40, "AD": 51, "BC": 31, "BD": 32, "CD": 33,
        "ABC": 94, "ABD": 104, "ACD": 96, "BCD": 86,
        "ABCD": 68,
        "A1B": 22, "B2C": 4, "C3D": 6, "AD4": 24,
        "A1B2C": 13, "B2C3D": 5, "AC3D4": 15, "A1BD4": 23,
        "A1BC": 157, "AB2C": 166, "B2CD": 176, "BC3D": 175,
        "AC3D": 167, "ACD4": 158, "A1BD": 185, "ABD4": 184,
        "A1BCD": 202, "AB2CD": 193,
        "ABC3D": 194, "ABCD4": 203,
        "A1B2CD": 123, "AB2C3D": 131,
        "ABC3D4": 121, "A1BCD4": 113,
        "A1B2C3D": 149, "AB2C3D4": 148,
        "A1BC3D4": 139, "A1B2CD4": 140,
        "A1BC3D": 211, "AB2CD4": 212,
        "A1B2C3D4": 14,
        "X": 41
      },
      2: {
        "A": 80, "B": 70, "C": 62, "D": 72,
        "AB": 52, "AC": 43, "AD": 54, "BC": 34, "BD": 35, "CD": 36,
        "ABC": 97, "ABD": 107, "ACD": 99, "BCD": 89,
        "ABCD": 71,
        "A1B": 25, "B2C": 7, "C3D": 9, "AD4": 27,
        "A1B2C": 16, "B2C3D": 8, "AC3D4": 18, "A1BD4": 26,
        "A1BC": 160, "AB2C": 169, "B2CD": 179, "BC3D": 178,
        "AC3D": 170, "ACD4": 161, "A1BD": 188, "ABD4": 187,
        "A1BCD": 205, "AB2CD": 196,
        "ABC3D": 197, "ABCD4": 206,
        "A1B2CD": 126, "AB2C3D": 134,
        "ABC3D4": 124, "A1BCD4": 116,
        "A1B2C3D": 152, "AB2C3D4": 151,
        "A1BC3D4": 142, "A1B2CD4": 143,
        "A1BC3D": 214, "AB2CD4": 215,
        "A1B2C3D4": 17,
        "X": 44
      }
    }
  }
};
