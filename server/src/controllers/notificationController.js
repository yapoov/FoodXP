const { sendNotification } = require("../utils/notificationUtils");

exports.getNotifications = async (req, res) => {
  try {
    const data = {
      expired: [],
      expiringSoon: [],
    };

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    data.expired = req.user.items.filter(
      (item) => new Date(item.expiryDate) < today
    );
    data.expiringSoon = req.user.items.filter(
      (item) =>
        new Date(item.expiryDate) >= today &&
        new Date(item.expiryDate) < tomorrow
    );

    res.json({ message: "Notifications retrieved successfully", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve notifications", error });
  }
};

exports.subscribe = async (req, res) => {
  const subscription = req.body;
  req.user.subscription = subscription;
  await req.user.save();
  res.status(201).json({ message: "Subscription saved" });
  const payload = { title: "Subscription enabled" };
  sendNotification(subscription, payload).catch((err) => console.error(err));
};

exports.unsubscribe = async (req, res) => {
  req.user.subscription = null;
  await req.user.save();

  res.status(201).json({ message: "Subscription disabled" });
};
