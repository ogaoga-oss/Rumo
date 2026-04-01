// ~/Rumo/server/middleware/rateLimit.js

const { redisClient } = require("../config/redis");

const WINDOW = 60; // 秒
const MAX = 30;

module.exports = async function rateLimit(req, res, next) {
  try {
    const ip = req.ip;
    const key = `rate:${ip}`;

    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, WINDOW);
    }

    if (current > MAX) {
      return res.status(429).json({
        error: "Too many requests"
      });
    }

    next();
  } catch (err) {
    console.error("RateLimit error:", err.message);
    next(); // エラー時は通す（安全側）
  }
};
