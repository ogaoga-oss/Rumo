const webpush = require("web-push");

const publicKey = "YOUR_PUBLIC_VAPID_KEY";
const privateKey = "YOUR_PRIVATE_VAPID_KEY";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicKey,
  privateKey
);

let subscriptions = [];

function addSubscription(sub) {
  subscriptions.push(sub);
}

function sendNotification(data) {
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, JSON.stringify(data))
      .catch(err => console.error(err));
  });
}

module.exports = { addSubscription, sendNotification };
