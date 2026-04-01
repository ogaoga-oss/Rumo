const cors = require("cors");
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const { giveDailyRewards } = require("./services/dailyRewardService");
const { addPoints } = require("./services/userService");
const { users } = require("./services/userService");

const socketHandler = require("./socket");
socketHandler(io);


let lastRanking = [];

const newPost = new Post(data);

// ランキングチェック（5秒ごと）
setInterval(() => {
  const current = [...users].sort((a,b)=>(b.invites||0)-(a.invites||0));

  current.forEach((user, index) => {
    const oldIndex = lastRanking.findIndex(u => u.id === user.id);

    if(oldIndex !== -1 && oldIndex < index){
      // 順位下がった
      io.emit("rankDown", {
        userId: user.id,
        username: user.username,
        newRank: index + 1
      });
    }
  });

  lastRanking = current.map(u => ({ id: u.id }));
}, 5000);



// 👇これ追加（重要）
app.use((req, res, next) => {
  giveDailyRewards(addPoints);
  next();
});

app.use(express.json());

// フロント公開
app.use(express.static(path.join(__dirname, '../client')));

// 追加
const authRoutes = require("./routes/auth");

// 追加
app.use("/api/auth", authRoutes);

const rankingRoutes = require("./routes/ranking");
app.use("/api/ranking", rankingRoutes);


// 追加
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

// デモ用メモリ
let users = {};
let messages = [];

// 接続
io.on('connection', (socket) => {
  console.log("接続:", socket.id);

  socket.on('join', (user) => {
    users[socket.id] = user;
  });

  socket.on('chatMessage', (msg) => {
    const user = users[socket.id];
    const data = {
      username: user?.username || "名無し",
      message: msg
    };
    messages.push(data);
    io.emit('chatMessage', data);
  });

    io.on("connection", (socket) => {

  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

});

  socket.on('disconnect', () => {
    delete users[socket.id];
  });
});

server.listen(8082, () => {
  console.log("http://localhost:8082 で起動");
});
