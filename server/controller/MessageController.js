const { setMessage } = require('../helper/RedisController');

//Code for send broadcast message
const sendBroadcastMessageController = (io, socket) => async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ status: 400, message: 'Data is required' });
    }

    const messageData = {
      sender: socket.id,
      message,
      type: 'broadcast',
      timestamp: new Date(),
      to: 'All',
    };
    // Send to target socket
    socket.broadcast.emit('broadcastMessage', messageData);
    //Function to set data in redis
    await setMessage(socket.id, messageData);
    return res.status(200).json({
      status: 200,
      message: `Broadcast message send to from ${socket.id} to All`,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Server problem' });
  }
};

//Code for send message private
const sendPrivateMessageController = (io, socket) => async (req, res) => {
  try {
    const { targetSocketId, message } = req.body;

    if (!targetSocketId || !message) {
      return res.status(400).json({ status: 400, message: 'Data is required' });
    }

    const messageData = {
      sender: socket.id,
      message,
      type: 'private',
      timestamp: new Date(),
      to: targetSocketId,
    };
    // Send to target socket
    io.to(targetSocketId).emit('privateMessage', messageData);
    //Function to set data in redis
    await setMessage(socket.id, messageData);
    return res.status(200).json({
      status: 200,
      message: `Private message send to from ${socket.id} to ${targetSocketId}`,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Server problem' });
  }
};

//code for send message in room
const sendRoomMessageController = (io, socket) => async (req, res) => {
  try {
    const { roomId, message } = req.body;
    if (!roomId || !message) {
      return res.status(400).json({ status: 400, message: 'Data is required' });
    }

    const messageData = {
      sender: socket.id,
      message,
      type: 'room',
      timestamp: new Date(),
      to: `Room id ${roomId}`,
    };

    io.to(roomId).emit('roomMessage', messageData);
    await setMessage(socket.id, messageData);
    return res
      .status(200)
      .json({ statu: 200, message: `Room message sent to ${roomId}` });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error' });
  }
};

module.exports = {
  sendBroadcastMessageController,
  sendPrivateMessageController,
  sendRoomMessageController,
};
