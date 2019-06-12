// reads in our .env file and makes those values available as environment variables
require('dotenv').config();
const GameController = require('./server/gameController');
const ios = require('socket.io-express-session');
const express_session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const defaultExport = require('./generation/generationBenchmark');
const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');
const express = require('express');


class ServerController{
    constructor(){
        this.gameControllers = [];
        this.session = express_session({ secret: process.env.PUBLIC_KEY });
        // create an instance of an express app
        this.app = express();
        //create server instance
        this.server = require('http').Server(this.app);
        this.passport = passport;
        //default configuration for easier initialisation of game Controller.
        // used to build the Game
        this.defaultConfiguration = {width:50, height:40, tilesize: 24};
    }

    initialize(){
        let self = this;
        return new Promise(
            function (resolve, reject) {
                self.initializeMongoConnection();
                self.initializePassport();
                self.intializeRoutes();
                self.addGameController(self.defaultConfiguration).then(
                    function (successInfo) {
                        self.server.listen(process.env.PORT || 3000, function () {
                            console.log(`Listening on ${self.server.address().port}`);
                          });
                          resolve(successInfo);
                    }
                ).catch(
                    function (errorInfo) {
                        reject(errorInfo);
                    }
                )
            }
        )
    }

    initializePassport(){
        // update express settings
        this.app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.json()); // parse application/json
        this.app.use(cookieParser());
        // a session module
        this.app.use(this.session);
        // passport session shenaningans
        this.passport.serializeUser(function(user, done) {
            done(null, user);
        });
        // more passport session shenaningans
        this.passport.deserializeUser(function(user, done) {
            done(null, user);
        });
        this.app.use(passport.initialize());
        // More and more session module
        this.app.use(passport.session());
    }

    /**
     * setup mongo connection
     */
    initializeMongoConnection(){
        const uri = process.env.MONGO_CONNECTION_URL;
        mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex: true });
        mongoose.connection.on('error', (error) => {
        console.log(error);
        process.exit(1);
        });
        mongoose.connection.on('connected', function () {
        console.log('connected to mongo');
        });
    }

    intializeRoutes(){
        let self = this;
        // require passport auth
        require('./auth/auth');
        this.app.use(express.static(__dirname));
        this.app.get('/generation', function (req, res) {
            defaultExport().then(
              () => {
                res.sendFile(__dirname + '/generation/render/index.html');
              });
        });
        this.app.get('/game.html', passport.authenticate('jwt', { session : true }), function (req, res) {
            res.sendFile(__dirname + '/public/game.html');
          });
        this.app.get('/', function (req, res) {
            res.sendFile(__dirname + '/public/index.html');
        });
        this.app.get('/index.html', function (req, res) {
            res.sendFile(__dirname + '/public/index.html');
        });

        this.app.post('/submit-chatline', passport.authenticate('jwt', { session : true }), function (req, res){
            const { message } = req.body;
            const { email, name } = req.user;
            // await ChatModel.create({ email, message });
            //console.log(self.gameControllers.length);
            self.gameControllers.forEach(controller => {
                controller.io.emit('new-message', {
                    username: name,
                    message,
                });
            });
            res.status(200).json({ status: 'ok' });
        });

        // main routes
        this.app.use('/', routes);
        this.app.use('/', passport.authenticate('jwt', { session : true }), secureRoutes);

        // catch all other routes
        this.app.use((req, res, next) => {
            res.status(404).json({ message: '404 - Not Found' });
        });

        // handle errors
        this.app.use((err, req, res, next) => {
            console.log(err.message);
            res.status(err.status || 500).json({ error: err.message });
        });
    }
    
    addGameController(config){
        let self = this;
        return new Promise(
            function (resolve, reject) {
                let io = require('socket.io').listen(self.server);
                io.use(ios(self.session));
                // link between socket.io and express session
                let gameController = new GameController(io, config);
                self.gameControllers.push(gameController);
                resolve();
            }
        )
    }
}
module.exports = ServerController;