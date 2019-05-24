const socketIo = require('socket.io');

class Io {
    constructor(server){
        this.io = socketIo.listen(server);
        this.io.on('connection', function (socket) {
            console.log('a user connected');
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
        });
    }
}

module.exports = Io;