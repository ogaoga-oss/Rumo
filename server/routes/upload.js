const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  res.json({
    url: `http://localhost:8082/uploads/images/${req.file.filename}`
  });
});

module.exports = router;
