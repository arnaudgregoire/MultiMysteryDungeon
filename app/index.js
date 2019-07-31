const http = require("http");
const express = require("express");
const sessionExpress = require("express-session");
const socketIO = require("socket.io")
const sessionSocket = require("socket.io-express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const ServerController = require("./controller/server-controller");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

var app = express();
var server = http.Server(app);
var session = sessionExpress({ secret: process.env.PUBLIC_KEY });

// Setup app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session);

// Setup Passport
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());

// TODO: DO NOT SERVE EVERYTHING AS STATIC !!!
app.use(express.static(__dirname));


// Setup MongoDB
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
  useNewUrlParser : true,
  useCreateIndex: true
});
mongoose.connection.on("error", (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on("connected", function () {
  console.log("connected to mongo");
});

// Routing
// TODO: move routing to route/index.js
require("./script/auth");
const mainRouting   = require("./route/main");

// TODO: WTF is this shit ?
const defaultExport = require("./generation/generationBenchmark");
app.get("/generation", function (req, res) {
  defaultExport().then(() => {
    res.sendFile(__dirname + "/public/generationViewer/generationViewer.html");
  });
});
app.get("/game.html", passport.authenticate("jwt", { session : true }), function (req, res) {
  res.sendFile(__dirname + "/public/game.html");
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/index.html", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/", mainRouting);

app.use((req, res, next) => {
  res.status(404).json({ message: "404 - Not Found" });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// Setup Websocket
var websocket = socketIO.listen(server);
websocket.use(sessionSocket(session));


// PRESS START TO PLAY
var serverController = new ServerController(websocket);

server.listen(PORT, function () {
  console.log("Listening on port: " + server.address().port);
  serverController.addGameController();
});
