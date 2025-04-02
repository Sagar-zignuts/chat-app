const redis = require('redis');

// Redis connection part
const redisClient = redis.createClient({
  url: 'redis://127.0.0.1:6379',
});

//Check is any errors are there in redis connection
redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('connected');
  } catch (err) {
    console.error('Redis connection or test error:', err);
  }
})();

module.exports = { redisClient };
