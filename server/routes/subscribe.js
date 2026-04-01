const express = require("express");
const router = express.Router();

const { addSubscription } = require("../services/pushService");

router.post("/", (req, res) => {
  addSubscription(req.body);
  res.sendStatus(201);
});

module.exports = router;
