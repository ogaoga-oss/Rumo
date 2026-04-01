let posts = [];

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://rumoUser:XM4Col316@rumouser.1dch1mn.mongodb.net/?appName=rumoUser)

");

console.log("DB接続OK");

const Post = require("./models/Post");


module.exports = (io) => {

  const users = {}; // userId → socket.id

  io.on("connection", (socket) => {

    // =========================
    // 👤 ユーザー登録
    // =========================
    socket.on("user:join", (userId) => {
      users[userId] = socket.id;
    });

    // =========================
    // 💬 チャット
    // =========================
    socket.on("chat:send", (data) => {
      const to = users[data.to];
      if(to){
        io.to(to).emit("chat:receive", data);
      }
    });

    // =========================
    // 📞 通話
    // =========================
    socket.on("call:offer", (data) => {
      const to = users[data.to];
      if(to){
        io.to(to).emit("call:offer", data);
      }
    });

    socket.on("call:answer", (data) => {
      const to = users[data.to];
      if(to){
        io.to(to).emit("call:answer", data);
      }
    });

   // 📝 投稿
socket.on("create_post", async (data)=>{
  const newPost = new Post(data);
  await newPost.save();

  io.emit("new_post", newPost);
});

      socket.on("get_posts", async ()=>{
  const posts = await Post.find().sort({ createdAt: -1 });
  socket.emit("load_posts", posts);
});


      // ❤️ いいね
socket.on("like_post", (data)=>{
  io.emit("post_liked", data);
});

      
    // =========================
    // 🔌 切断
    // =========================
    socket.on("disconnect", () => {
      for(const userId in users){
        if(users[userId] === socket.id){
          delete users[userId];
        }
      }
    });

  });

};
