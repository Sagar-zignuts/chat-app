const { redisClient } = require('../config/RedisConfig');

//Created helper for set data into the redis
const setMessage = async (socketId, messageData) => {
  try {
    const messageKey = `${socketId}_${Date.now()}`;
    await redisClient.setEx(messageKey, 3600, JSON.stringify({ messageData }));
  } catch (error) {
    console.log(`Error in redis controller : ${error.message}`);
  }
};

module.exports = { setMessage };
