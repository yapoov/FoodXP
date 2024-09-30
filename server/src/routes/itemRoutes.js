const express = require("express");
const {
  addItems,
  getItems,
  getItemByName,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

const router = express.Router();

router.post("/", addItems); // Add item
router.get("/", getItems); // Get all items with optional filtering
router.get("/:name", getItemByName); // Get single item by name
router.put("/:id", updateItem); // Update item by name
router.delete("/:id", deleteItem); // Delete item by name

module.exports = router;
