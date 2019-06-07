// reads in our .env file and makes those values available as environment variables
require('dotenv').config();

const express = require('express');
const express_session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const ios = require('socket.io-express-session');
const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');
const DbManager = require('./server/dbManager');
const asyncMiddleware = require('./middleware/asyncMiddleware');
const defaultExport = require('./generation/generationBenchmark');

const jsdom = require('jsdom');
const Datauri = require('datauri');

var session = express_session({ secret: 'top_secret' });

// setup mongo connection
const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex: true });
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('connected to mongo');
});

// passport session shenaningans
passport.serializeUser(function(user, done) {
  done(null, user);
});
// more passport session shenaningans
passport.deserializeUser(function(user, done) {
  done(null, user);
});
// create an instance of an express app
const app = express();

//create server instance
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const datauri = new Datauri();
const { JSDOM } = jsdom;

// random sessions shenanigans link between socket.io and express session
io.use(ios(session));
// update express settings
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());
// a session module
app.use(session);
// More session module
app.use(passport.initialize());
// More and more session module
app.use(passport.session());

// require passport auth
require('./auth/auth');

app.use(express.static(__dirname));

app.get('/generation', function (req, res) {
  defaultExport().then(
    () => {
      res.sendFile(__dirname + '/generation/render/index.html');
    });
})

app.get('/game.html', passport.authenticate('jwt', { session : true }), function (req, res) {
  res.sendFile(__dirname + '/public/game.html');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/index.html', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

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

// main routes
app.use('/', routes);
app.use('/', passport.authenticate('jwt', { session : true }), secureRoutes);

// catch all other routes
app.use((req, res, next) => {
  res.status(404).json({ message: '404 - Not Found' });
});

// handle errors
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({ error: err.message });
});




function setupServer() {
  JSDOM.fromFile(__dirname + '/server/dom/index.html', {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true
  }).then((dom) => {

    dom.window.savePlayer = function (player) {
      return DbManager.savePlayer(player);
    }
    dom.window.loadPlayer = function (playerId){
      return DbManager.loadPlayer(playerId);
    }
    dom.window.URL.createObjectURL = (blob) => {
      if (blob){
        return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
      }
    };

    dom.window.URL.revokeObjectURL = (objectURL) => {};
    
    dom.window.gameLoaded = function() {
      dom.window.io = io;
      // have the server start listening on the provided port
      server.listen(process.env.PORT || 3000, function () {
        console.log(`Listening on ${server.address().port}`);
      });
    };
  }).catch((error) => {
    console.log(error.message);
  });
}
 
setupServer();