const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: "#222222",
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  const game = new Phaser.Game(config);
  
  function preload() {
    this.load.tilemapCSV("map", "maps/testMap.csv");
    this.load.image("tiles", "maps/tileset.png");
  }
  
  function create() {
    const map = this.make.tilemap({ key: "map", tileWidth: 24, tileHeight: 24 });
    const tileset = map.addTilesetImage("tiles");
    const layer = map.createStaticLayer(0, tileset, 0, 0);
      // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    // Set up the arrows to control the camera
    const cursors = this.input.keyboard.createCursorKeys();
    controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: camera,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    });
        // Help text that has a "fixed" position on the screen
    this.add
    .text(16, 16, "Arrow keys to scroll", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000000"
    })
    .setScrollFactor(0);
    

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }
  
  function update(time, delta) {
    controls.update(delta);
  }