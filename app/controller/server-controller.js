const GameController = require("./game-controller");

class ServerController {
  constructor(websocket) {
    this.websocket = websocket;
    this.gameControllers = [];
    // TODO: move default GameController config to GameController
    this.defaultConfiguration = {
      width: 50,
      height: 40,
      tilesize: 24
    };
  }

  addGameController() {
    let controller = new GameController(this.websocket, this.defaultConfiguration);
    this.gameControllers.push(controller);
  }

}

module.exports = ServerController;
