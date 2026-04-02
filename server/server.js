const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const { giveDailyRewards } = require("./services/dailyRewardService");
const { addPoints, getRanking, findUserById, addInvite, createUser } = require("./services/userService");

const socketHandler = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://rumo-tawny.vercel.app",
    credentials: true
  }
});

// Socket.ioハンドラー
socketHandler(io);

let lastRanking = [];

// MongoDB接続
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB接続成功"))
  .catch(err => console.log("❌ MongoDB接続失敗", err));

// JSONパース
app.use(express.json());

// デイリー報酬
app.use(async (req, res, next) => {
  await giveDailyRewards();
  next();
});

// フロント公開
app.use(express.static(path.join(__dirname, "../client")));

// ルーティング
const authRoutes = require("./routes/auth");
const rankingRoutes = require("./routes/ranking");
const inviteRoutes = require("./routes/invite");

app.use("/api/auth", authRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/invite", inviteRoutes);

// 認証ミドルウェア
const auth = require("../middleware/auth");

app.get("/api/me", auth, async (req, res) => {
  const user = await findUserById(req.user.id);
  res.json(user);
});

// ランキングチェック（5秒ごと）
setInterval(async () => {
  const ranking = await getRanking();

  ranking.forEach((user, index) => {
    const oldIndex = lastRanking.findIndex(u => u.id === user._id.toString());

    if (oldIndex !== -1 && oldIndex < index) {
      // 順位下がった
      io.emit("rankDown", {
        userId: user._id,
        username: user.username,
        newRank: index + 1
      });
    }
  });

  lastRanking = ranking.map(u => ({ id: u._id.toString() }));
}, 5000);

// デモ用チャット（Socket.io）
let messages = [];
let connectedUsers = {};

io.on("connection", (socket) => {
  console.log("接続:", socket.id);

  socket.on("join", (user) => {
    connectedUsers[socket.id] = user;
  });

  socket.on("chatMessage", (msg) => {
    const user = connectedUsers[socket.id];
    const data = {
      username: user?.username || "名無し",
      message: msg
    };
    messages.push(data);
    io.emit("chatMessage", data);
  });

  socket.on("offer", (offer) => socket.broadcast.emit("offer", offer));
  socket.on("answer", (answer) => socket.broadcast.emit("answer", answer));

  socket.on("disconnect", () => {
    delete connectedUsers[socket.id];
  });
});

// サーバー起動
const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT} で起動`);
});
