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
        this.session = express_session({ secret: 'top_secret' });
        // create an instance of an express app
        this.app = express();
        //create server instance
        this.server = require('http').Server(this.app);
        this.passport = passport;
    }

    initialize(){
        let self = this;
        return new Promise(
            function (resolve, reject) {
                self.initializeMongoConnection();
                self.initializePassport();
                self.intializeRoutes();
                self.addGameController().then(
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
        // require passport auth
        require('./auth/auth');
        this.app.use(express.static(__dirname));
        console.log(__dirname);
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

    addGameController(){
        let self = this;
        return new Promise(
            function (resolve, reject) {
                const io = require('socket.io').listen(self.server);
                io.use(ios(self.session));
                // link between socket.io and express session
                let gameController = new GameController(io);
                gameController.initialize()
                .then(()=>{
                    self.gameControllers += [gameController];
                    resolve();
                })
                .catch((error) => {reject(error)})
            }
        )
    }
}
module.exports = ServerController;