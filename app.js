const ServerController = require('./serverController');
let serverController = new ServerController();
serverController.initialize();
serverController.addGameController().then(function () {
  console.log("second game Controller deployed");
});


