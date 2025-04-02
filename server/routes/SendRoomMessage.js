const {
  sendRoomMessageController,
} = require('../controller/MessageController');

const sendRoomMessage = (app, io, redisClient) => {
  //provide redisClietn to controller
  app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
  });

  //handle API of room message
  app.post('/roomMsg', (req, res) => {
    const { socketId } = req.body;

    const targetSocket = io.sockets.sockets.get(req.body.socketId);
    if (targetSocket) {
      sendRoomMessageController(io, targetSocket)(req, res);
    }
  });
};

module.exports = { sendRoomMessage };
