const { sendPrivateMessage } = require('./SendPrivateMessage');
const { sendBroadcastMessage } = require('./SendBroadCastMessage');
const { sendRoomMessage } = require('./SendRoomMessage');

//All routes
const setupRoutes = (app, io, redisClient) => {
  sendPrivateMessage(app, io, redisClient);
  sendBroadcastMessage(app, io, redisClient);
  sendRoomMessage(app, io, redisClient);
};

module.exports = { setupRoutes };
