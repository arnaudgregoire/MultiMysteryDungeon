const jsdom = require('jsdom');
const Datauri = require('datauri');
const DbManager = require('./dbManager');

class GameController{
     
    constructor(io){
        this.io = io;
    }

    initialize(){
        let self = this;
        const datauri = new Datauri();
        const { JSDOM } = jsdom;
        
        return new Promise(
            function (resolve, reject) {
                JSDOM.fromFile(__dirname + '/dom/index.html', {
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
                        dom.window.io = self.io;
                        resolve();
                    };
                }).catch((error) => {
                    reject(error.message);
                });
            }
        )
    }
}

module.exports = GameController;