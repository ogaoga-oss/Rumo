const users = require("../models/User");

// ユーザー作成
function createUser(user){
  users.push(user);
}

// ユーザー取得
function findUserById(id){
  return users.find(u => u.id === id);
}

// 招待カウント
function addInvite(userId){
  const user = findUserById(userId);
  if(user){
    user.invites = (user.invites || 0) + 1;
  }
}

function getRanking(){
  return users
    .sort((a,b)=>(b.invites||0)-(a.invites||0))
    .slice(0,10)
    .map(u => ({
      id: u.id, // 👈追加
      username: u.username,
      invites: u.invites || 0
    }));
}


// ポイント加算
function addPoints(userId, points){
  const user = findUserById(userId);
  if(user){
    user.points = (user.points || 0) + points;
  }
}

module.exports = {
  createUser,
  findUserById,
  addPoints,
  users
};
