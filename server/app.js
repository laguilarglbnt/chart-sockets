const { Server } = require('socket.io');

const io = new Server(3000, {
    transports: ['websocket']
});

io.on('connection', (socket) => {

    socket.on('timeTypeChange', timeType => {
        console.log(timeType);
        socket.broadcast.emit('timeTypeChange', timeType);
    });

    socket.on('addSerie', serie => {
        console.log(serie);
        socket.broadcast.emit('addSerie', serie);
    });

    socket.on('disconnect', () => console.log('User disconnected'));

    console.log(`${io.sockets.sockets.size} users connected`);
});
