const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { setupRoutes } = require('./routes/index');
const { redisClient } = require('./config/RedisConfig');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// To prevent cors errors
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

// Creating io server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Match your React dev server port
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());

//Start connection
io.on('connection', (socket) => {
  console.log(`Socket connected with id: ${socket.id}`);

  //set room id
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
  });

  //run when client disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

//Main route
setupRoutes(app, io, redisClient);

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
