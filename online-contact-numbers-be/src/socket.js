const { Server } = require('socket.io');
let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
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

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

module.exports = { initializeSocket, getIO };
