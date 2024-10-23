const app = require('./app');
const { createServer } = require('http');
const { initializeSocket } = require('./socket');
const PORT = process.env.PORT || 3000;

const server = createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});