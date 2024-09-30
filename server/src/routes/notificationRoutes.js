const express = require("express");
const {
  getNotifications,
  subscribe,
  unsubscribe,
} = require("../controllers/notificationController");

const router = express.Router();
router.get("/", getNotifications);
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
module.exports = router;
