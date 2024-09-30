const webpush = require("web-push");
const schedule = require("node-schedule");
require("dotenv").config();

webpush.setGCMAPIKey(process.env.GCMAPI_KEY);
webpush.setVapidDetails(
  "https://www.foodexp.com",
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

const sendNotification = (subscription, payload) => {
  if (!subscription) return;
  return webpush
    .sendNotification(subscription, JSON.stringify(payload))
    .then((res) => console.log("Notification sent", res))
    .catch((error) => {
      console.error("Error sending notification", error);
      throw error;
    });
};

const scheduleNotification = (item, user) => {
  const expiryDate = new Date(item.expiryDate);
  const notificationTime = new Date(expiryDate.getTime() - 24 * 60 * 60 * 1000); // Notify 1 day before expiry

  if (notificationTime > new Date()) {
    schedule.scheduleJob(notificationTime, () => {
      const payload = {
        title: "Expiry Reminder",
        body: `Your ${item.name} about to expire!`,
      };
      sendNotification(user.subscription, payload);
    });
  } else {
    const payload = {
      title: "Expiry Reminder",
      body: `Your ${item.name} is expired!`,
    };
    sendNotification(user.subscription, payload);
  }
};
module.exports = { sendNotification, scheduleNotification };
