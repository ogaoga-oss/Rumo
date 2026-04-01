let localStream;
let peerConnection;
let socket;

// STUNサーバー（無料）
const config = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};

// 初期化（Socket接続）
function initCall(username) {
  socket = io("/", { query: { username } });

  socket.on("webrtc-offer", async (data) => {
    await handleOffer(data.offer, data.from);
  });

  socket.on("webrtc-answer", async (data) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  });

  socket.on("webrtc-ice", async (data) => {
    try {
      await peerConnection.addIceCandidate(data.candidate);
    } catch (e) {
      console.error(e);
    }
  });
}

// カメラ・マイク取得
async function startMedia() {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });

  document.getElementById("localVideo").srcObject = localStream;
}

// 発信
async function startCall() {
  peerConnection = createPeerConnection();

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("webrtc-offer", { offer });
}

// 着信処理
async function handleOffer(offer, from) {
  peerConnection = createPeerConnection();

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("webrtc-answer", { answer, to: from });
}

// PeerConnection作成
function createPeerConnection() {
  const pc = new RTCPeerConnection(config);

  // 相手の映像受信
  pc.ontrack = (event) => {
    document.getElementById("remoteVideo").srcObject = event.streams[0];
  };

  // ICE候補送信
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("webrtc-ice", { candidate: event.candidate });
    }
  };

  return pc;
}

// 通話終了
function endCall() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }

  document.getElementById("localVideo").srcObject = null;
  document.getElementById("remoteVideo").srcObject = null;
}

const socket = io("http://localhost:8082");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let localStream;
let peerConnection;

const roomId = localStorage.getItem("chatUser");

// STUNサーバー
const config = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};

// 通話開始
async function startCall() {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });

  localVideo.srcObject = localStream;

  peerConnection = new RTCPeerConnection(config);

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        candidate: event.candidate,
        roomId
      });
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("offer", { offer, roomId });
}

// 受信（Offer）
socket.on("offer", async (offer) => {
  peerConnection = new RTCPeerConnection(config);

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });

  localVideo.srcObject = localStream;

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  await peerConnection.setRemoteDescription(offer);

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("answer", { answer, roomId });
});

// 受信（Answer）
socket.on("answer", async (answer) => {
  await peerConnection.setRemoteDescription(answer);
});

// ICE
socket.on("ice-candidate", async (candidate) => {
  try {
    await peerConnection.addIceCandidate(candidate);
  } catch (e) {
    console.error(e);
  }
});

// 終了
function endCall() {
  if (peerConnection) peerConnection.close();
}

async function startScreenShare() {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true
  });

  const screenTrack = screenStream.getTracks()[0];

  const sender = peerConnection
    .getSenders()
    .find(s => s.track.kind === "video");

  sender.replaceTrack(screenTrack);

  // 画面共有終了したら元に戻す
  screenTrack.onended = () => {
    const videoTrack = localStream.getTracks().find(t => t.kind === "video");
    sender.replaceTrack(videoTrack);
  };
}

function toggleMute() {
  const audioTrack = localStream.getAudioTracks()[0];
  audioTrack.enabled = !audioTrack.enabled;
}

function toggleCamera() {
  const videoTrack = localStream.getVideoTracks()[0];
  videoTrack.enabled = !videoTrack.enabled;
}
