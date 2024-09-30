const { scheduleNotification } = require("../utils/notificationUtils");
const { ObjectId } = require("mongodb");
exports.addItems = async (req, res) => {
  try {
    const items = req.body;
    if (!req.user.items) {
      req.user.items = [];
    }
    items.forEach((item) => {
      req.user.items.push(item);
    });
    await req.user.save();

    items.forEach((item) => {
      if (item.expiryDate) {
        scheduleNotification(item, req.user);
      }
    });
    res.status(201).json({ message: "Items saved successfully", data: items });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save item", error });
  }
};

exports.getItems = async (req, res) => {
  try {
    let items = req.user.items;

    // Filter items by expiry date if requested
    if (req.query.filterDate) {
      items = items.filter((item) => item.expiryDate === req.query.filterDate);
    }

    res.json({ message: "Items retrieved successfully", data: items });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve items", error });
  }
};

exports.getItemByName = async (req, res) => {
  try {
    const item = req.user.items.find((item) => item.name === req.params.name);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item retrieved successfully", data: item });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve item", error });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = req.user.items.find((e) => {
      return e._id.equals(new ObjectId(req.params.id));
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    Object.assign(item, req.body);
    await req.user.save();

    res.json({ message: "Item updated successfully", data: item });
  } catch (error) {
    res.status(500).json({ message: "Failed to update item", error });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = req.user.items.find((e) => {
      return e._id.equals(new ObjectId(req.params.id));
    });
    console.log(item);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    req.user.items.pull(item);
    await req.user.save();

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete item", error });
  }
};
