const { RTCPeerConnection, RTCSessionDescription } = require("wrtc");

// 簡易SFU不要、クライアント同士のP2Pを中継するだけのデモ
function createPeerConnection() {
  const pc = new RTCPeerConnection();

  pc.onicecandidate = (event) => {
    if(event.candidate) {
      // Socket.io経由で送信
    }
  };

  pc.ontrack = (event) => {
    // クライアント側で remoteVideo に接続
  };

  return pc;
}

module.exports = { createPeerConnection };
