<<<<<<< HEAD
const ServerController = require('./serverController');
let serverController = new ServerController();
serverController.initialize();
serverController.addGameController().then(function () {
  console.log("second game Controller deployed");
});

=======


/*
app.post('/submit-chatline', passport.authenticate('jwt', { session : false }), asyncMiddleware(async (req, res, next) => {
  const { message } = req.body;
  const { email, name } = req.user;
  // await ChatModel.create({ email, message });
  io.emit('new-message', {
    username: name,
    message,
  });
  res.status(200).json({ status: 'ok' });
}));
*/


const ServerController = require('./serverController');
let serverController = new ServerController();
serverController.initialize();

>>>>>>> e824b38b01ef8e0291708b4ec52d323439bd92ce

