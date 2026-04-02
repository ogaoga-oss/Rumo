const cors = require("cors");
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { giveDailyRewards } = require("./services/dailyRewardService");
const { addPoints, users } = require("./services/userService"); // users はそのまま使う

const socketHandler = require("./socket");
socketHandler(io);

let lastRanking = [];

// ランキングチェック（5秒ごと）
setInterval(() => {
  const current = [...users].sort((a,b)=>(b.invites||0)-(a.invites||0));

  current.forEach((user, index) => {
    const oldIndex = lastRanking.findIndex(u => u.id === user.id);

    if(oldIndex !== -1 && oldIndex < index){
      io.emit("rankDown", {
        userId: user.id,
        username: user.username,
        newRank: index + 1
      });
    }
  });

  lastRanking = current.map(u => ({ id: u.id }));
}, 5000);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB接続成功"))
  .catch(err => console.log("❌ MongoDB接続失敗", err));

// デモ用メモリ（名前を変更）
let connectedUsers = {};
let messages = [];

app.use((req, res, next) => {
  giveDailyRewards(addPoints);
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const rankingRoutes = require("./routes/ranking");
app.use("/api/ranking", rankingRoutes);

const inviteRoutes = require("./routes/invite");
app.use("/api/invite", inviteRoutes);

const auth = require("../middleware/auth");
const { findUserById } = require("../services/userService");

app.get("/api/me", auth, (req, res) => {
  const user = findUserById(req.user.id);
  res.json(user);
});

app.use(cors({
  origin: "https://rumo-tawny.vercel.app",
  credentials: true
}));

// 接続
io.on('connection', (socket) => {
  console.log("接続:", socket.id);

  socket.on('join', (user) => {
    connectedUsers[socket.id] = user;
  });

  socket.on('chatMessage', (msg) => {
    const user = connectedUsers[socket.id];
    const data = {
      username: user?.username || "名無し",
      message: msg
    };
    messages.push(data);
    io.emit('chatMessage', data);
  });

  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on('disconnect', () => {
    delete connectedUsers[socket.id];
  });
});

server.listen(8082, () => {
  console.log("http://localhost:8082 で起動");
});
