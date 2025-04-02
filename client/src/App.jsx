import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000', {
  reconnection: true,
});

function App() {
  const [message, setMessage] = useState('');
  const [targetId, setTargetId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Connected", socket.id);
      setSocketId(socket.id);
    });

    socket.on('privateMessage', (data) => {
      setMessages((prev) => [...prev, `Private message from ${data.sender}: ${data.message}`]);
    });

    socket.on('broadcastMessage', (data) => {
      setMessages((prev) => [...prev, `Broadcast from ${data.sender}: ${data.message}`]);
    });

    socket.on('roomMessage', (data) => {
      setMessages((prev) => [...prev, `Room message from ${data.sender} to ${data.to}: ${data.message}`]);
    });

    return () => {
      socket.off('connect');
      socket.off('privateMessage');
      socket.off('broadcastMessage');
      socket.off('roomMessage');
    };
  }, []);

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomId) {
      socket.emit('joinRoom', {roomId});
    }
  };

  const sendPrivateMessage = async (e) => {
    e.preventDefault();
    if (targetId && message) {
      try {
        await axios.post('http://localhost:3000/privateMsg', {
          socketId: socketId,
          targetSocketId: targetId,
          message,
        });
        setMessages((prev) => [...prev, `You to ${targetId}: ${message}`]);
        setMessage('');
      } catch (err) {
        console.error('Error sending private message:', err);
      }
    }
  };

  const sendBroadcastMessage = async (e) => {
    e.preventDefault();
    if (message) {
      try {
        await axios.post('http://localhost:3000/broadcastMsg', {
          socketId: socketId,
          message,
        });
        setMessages((prev) => [...prev, `You broadcast: ${message}`]);
        setMessage('');
      } catch (err) {
        console.error('Error sending broadcast message:', err);
      }
    }
  };

  const sendRoomMessage = async (e) => {
    e.preventDefault();
    if (roomId && message) {
      try {
        await axios.post('http://localhost:3000/roomMsg', {
          socketId: socketId,
          roomId,
          message,
        });
        setMessages((prev) => [...prev, `You to room ${roomId}: ${message}`]);
        setMessage('');
      } catch (err) {
        console.error('Error sending room message:', err);
      }
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div>
        <input
          type="text"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          placeholder="Target Socket ID"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendPrivateMessage}>Send Private</button>
        <button onClick={sendBroadcastMessage}>Broadcast</button>
        <button onClick={sendRoomMessage}>Send Room</button>
      </div>
      <p>Your Socket ID: {socketId}</p>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </form>
  );
}

export default App;