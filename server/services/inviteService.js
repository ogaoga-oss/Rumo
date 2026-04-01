const inviteCodes = require("../models/InviteCode");

// ランダムコード生成
function generateCode(length = 8){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for(let i=0;i<length;i++){
    code += chars[Math.floor(Math.random()*chars.length)];
  }
  return code;
}

// 新規コード作成
function createInvite(userId){
  const code = generateCode();

  const invite = {
    code,
    maxUses: 5,
    used: 0,
    createdBy: userId
  };

  inviteCodes.push(invite);

  return invite;
}

// 既存（そのまま）
function verifyInvite(code){
  const invite = inviteCodes.find(i => i.code === code);
  if(!invite) return { valid:false };

  if(invite.used >= invite.maxUses){
    return { valid:false };
  }

  return { valid:true, invite };
}

function consumeInvite(invite){
  invite.used++;
}

module.exports = {
  createInvite,
  verifyInvite,
  consumeInvite
};
