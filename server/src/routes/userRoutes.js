const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Adjust the path based on your project structure

router.get("/", userController.getUser);
router.put("/", userController.updateUser);
module.exports = router;
