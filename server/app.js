const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Match your React dev server port
    credentials: true,
    methods: ['GET', 'POST'],
  },
});


io.on('connection', (socket) => {
  console.log(`Socket connected with id: ${socket.id}`);

  //set room id
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    // console.log(`Socket id : ${socket.id} joined room : ${roomId}`);
  });

  // Handle private message
  socket.on('sendPrivateMessage', ({ targetSocketId, message }) => {
    const messageData = {
      sender: socket.id,
      message,
      type: 'private',
      timestamp: new Date(),
    };
    io.to(targetSocketId).emit('privateMessage', messageData); // Send to target socket
//     console.log(
// `Private message from ${socket.id} to ${targetSocketId}: ${message}`
//     );
  });

  //send broadcast message
  socket.on('sendBroadcastMessage', ({ message }) => {
    const messageData = {
      sender: socket.id,
      message,
      type: 'broadcast',
      timestamp: new Date(),
    };
    socket.broadcast.emit('broadcastMessage', messageData);
    // console.log(`Broadcast message from ${socket.id}: ${message}`);
  });

  //send room message
  socket.on('sendRoomMessage', ({ roomId, message }) => {
    const messageData = {
      sender: socket.id,
      message,
      type: 'room message',
      timestamp: new Date(),
    };
    socket.to(roomId).emit('roomMessage', messageData);
    // console.log(`Room message from ${socket.id} to room ${roomId}: ${message}`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});