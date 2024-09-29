const webpush = require("web-push");
require("dotenv").config();

webpush.setGCMAPIKey(process.env.GCMAPI_KEY);
webpush.setVapidDetails(
  "https://www.foodexp.com",
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

const sendNotification = (subscription, payload) => {
  return webpush
    .sendNotification(subscription, payload)
    .then((res) => console.log("Notification sent", res))
    .catch((error) => {
      console.error("Error sending notification", error);
      throw error;
    });
};

module.exports = { sendNotification };
