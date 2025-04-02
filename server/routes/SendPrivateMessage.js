const {
  sendPrivateMessageController,
} = require('../controller/MessageController');

const sendPrivateMessage = (app, io, redisClient) => {
  //provide redisClietn to controller
  app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
  });

  //handle API of private message
  app.post('/privateMsg', (req, res) => {
    const targetSocket = io.sockets.sockets.get(req.body.socketId);
    if (targetSocket) {
      sendPrivateMessageController(io, targetSocket)(req, res);
    }
  });
};

module.exports = { sendPrivateMessage };
