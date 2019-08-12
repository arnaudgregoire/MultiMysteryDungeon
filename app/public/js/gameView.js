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
        "A": 73,"B": 63,"C": 55, "D": 65,
        "AB": 45, "AC": 36, "AD": 47, "BC": 27, "BD": 28, "CD": 29,
        "ABC": 90, "ABD": 100, "ACD": 92, "BCD": 82,
        "ABCD": 64,
        "A1B": 18, "B2C": 0, "C3D": 2, "AD4": 20,
        "A1B2C": 9, "B2C3D": 1, "AC3D4": 11, "A1BD4": 19,
        "A1BC": 153, "AB2C": 162, "B2CD": 172, "BC3D": 171,
        "AC3D": 163, "ACD4": 154, "A1BD": 181, "ABD4": 180,
        "A1BCD": 198, "AB2CD": 189,
        "ABC3D": 190, "ABCD4": 199,
        "A1B2CD": 119, "AB2C3D": 127,
        "ABC3D4": 117, "A1BCD4": 109,
        "A1B2C3D": 145, "AB2C3D4": 144,
        "A1BC3D4": 135, "A1B2CD4": 136,
        "A1BC3D": 207, "AB2CD4": 208,
        "A1B2C3D4": 10,
        "X": 37
      },
      1: {
        "A": 76, "B": 66, "C": 58, "D": 68,
        "AB": 48, "AC": 39, "AD": 50, "BC": 30, "BD": 31, "CD": 32,
        "ABC": 93, "ABD": 103, "ACD": 95, "BCD": 85,
        "ABCD": 67,
        "A1B": 21, "B2C": 3, "C3D": 5, "AD4": 23,
        "A1B2C": 12, "B2C3D": 4, "AC3D4": 14, "A1BD4": 22,
        "A1BC": 156, "AB2C": 165, "B2CD": 175, "BC3D": 174,
        "AC3D": 166, "ACD4": 157, "A1BD": 184, "ABD4": 183,
        "A1BCD": 201, "AB2CD": 192,
        "ABC3D": 193, "ABCD4": 202,
        "A1B2CD": 122, "AB2C3D": 130,
        "ABC3D4": 120, "A1BCD4": 112,
        "A1B2C3D": 148, "AB2C3D4": 147,
        "A1BC3D4": 138, "A1B2CD4": 139,
        "A1BC3D": 210, "AB2CD4": 211,
        "A1B2C3D4": 13,
        "X": 40
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
        "A": 73,"B": 63,"C": 55, "D": 65,
        "AB": 45, "AC": 36, "AD": 47, "BC": 27, "BD": 28, "CD": 29,
        "ABC": 90, "ABD": 100, "ACD": 92, "BCD": 82,
        "ABCD": 64,
        "A1B": 18, "B2C": 0, "C3D": 2, "AD4": 20,
        "A1B2C": 9, "B2C3D": 1, "AC3D4": 11, "A1BD4": 19,
        "A1BC": 153, "AB2C": 162, "B2CD": 172, "BC3D": 171,
        "AC3D": 163, "ACD4": 154, "A1BD": 181, "ABD4": 180,
        "A1BCD": 198, "AB2CD": 189,
        "ABC3D": 190, "ABCD4": 199,
        "A1B2CD": 119, "AB2C3D": 127,
        "ABC3D4": 117, "A1BCD4": 109,
        "A1B2C3D": 145, "AB2C3D4": 144,
        "A1BC3D4": 135, "A1B2CD4": 136,
        "A1BC3D": 207, "AB2CD4": 208,
        "A1B2C3D4": 10,
        "X": 37
      },
      1: {
        "A": 76, "B": 66, "C": 58, "D": 68,
        "AB": 48, "AC": 39, "AD": 50, "BC": 30, "BD": 31, "CD": 32,
        "ABC": 93, "ABD": 103, "ACD": 95, "BCD": 85,
        "ABCD": 67,
        "A1B": 21, "B2C": 3, "C3D": 5, "AD4": 23,
        "A1B2C": 12, "B2C3D": 4, "AC3D4": 14, "A1BD4": 22,
        "A1BC": 156, "AB2C": 165, "B2CD": 175, "BC3D": 174,
        "AC3D": 166, "ACD4": 157, "A1BD": 184, "ABD4": 183,
        "A1BCD": 201, "AB2CD": 192,
        "ABC3D": 193, "ABCD4": 202,
        "A1B2CD": 122, "AB2C3D": 130,
        "ABC3D4": 120, "A1BCD4": 112,
        "A1B2C3D": 148, "AB2C3D4": 147,
        "A1BC3D4": 138, "A1B2CD4": 139,
        "A1BC3D": 210, "AB2CD4": 211,
        "A1B2C3D4": 13,
        "X": 40
      },
      2: {
        "A": 79, "B": 69, "C": 61, "D": 71,
        "AB": 51, "AC": 42, "AD": 53, "BC": 33, "BD": 34, "CD": 35,
        "ABC": 96, "ABD": 106, "ACD": 98, "BCD": 88,
        "ABCD": 70,
        "A1B": 24, "B2C": 6, "C3D": 8, "AD4": 26,
        "A1B2C": 15, "B2C3D": 7, "AC3D4": 17, "A1BD4": 25,
        "A1BC": 159, "AB2C": 168, "B2CD": 178, "BC3D": 177,
        "AC3D": 168, "ACD4": 160, "A1BD": 189, "ABD4": 186,
        "A1BCD": 204, "AB2CD": 195,
        "ABC3D": 196, "ABCD4": 205,
        "A1B2CD": 125, "AB2C3D": 133,
        "ABC3D4": 123, "A1BCD4": 115,
        "A1B2C3D": 151, "AB2C3D4": 150,
        "A1BC3D4": 141, "A1B2CD4": 142,
        "A1BC3D": 213, "AB2CD4": 214,
        "A1B2C3D4": 16,
        "X": 43
      }
    }
  }
};
