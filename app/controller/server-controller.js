const GameController = require("./game-controller");
const ENUM_DUNGEON = require("../type/enums").ENUM_DUNGEON;

class ServerController {
  constructor(websocket) {
    this.websocket = websocket;
    this.gameControllers = [];
    // TODO: move default GameController config to GameController
    this.defaultConfiguration = 
    {
      'width': 60,
      'height': 60,
      'tilesize': 24,
      'roomCount': 10,
      'minimumSize': 3,	
      'maximumSize': 10,
      'dungeon': ENUM_DUNGEON.TINY_WOODS,
      'numberOfItems': 10
    };
  }

  addGameController() {
    let controller = new GameController(this.websocket, this.defaultConfiguration);
    this.gameControllers.push(controller);
  }

}

module.exports = ServerController;
