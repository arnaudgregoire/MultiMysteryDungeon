class ServerController{
    constructor(app, server, io){
        this.server = server;
        this.app = app;
        this.io = io;
    }
}
module.exports = ServerController;