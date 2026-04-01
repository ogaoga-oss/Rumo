// ~/Rumo/server/middleware/rateLimit.js
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const redisClient = require("../config/redis");

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分
  max: 30,             // 1分あたり30リクエスト
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args)
  })
});

module.exports = apiLimiter;
