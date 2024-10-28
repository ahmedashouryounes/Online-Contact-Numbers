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

    socket.on('refreshData', (data) => {
      socket.broadcast.emit('refreshData');
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
