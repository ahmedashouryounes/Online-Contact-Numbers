const { Server } = require('socket.io');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('contactLocked', (data) => {
      socket.broadcast.emit('contactLocked', data);
    });

    socket.on('contactUnlocked', (data) => {
      socket.broadcast.emit('contactUnlocked', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
}

module.exports = { initializeSocket };