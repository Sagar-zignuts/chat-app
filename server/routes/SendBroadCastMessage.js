const {
  sendBroadcastMessageController,
} = require('../controller/MessageController');

const sendBroadcastMessage = (app, io, redisClient) => {
  //provide redisClietn to controller
  app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
  });
  //handle API of broadcast message
  app.post('/broadcastMsg', (req, res) => {
    const targetSocket = io.sockets.sockets.get(req.body.socketId);
    if (targetSocket) {
      sendBroadcastMessageController(io, targetSocket)(req, res);
    }
  });
};

module.exports = { sendBroadcastMessage };
