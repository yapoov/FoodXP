const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const itemSchema = require("./itemModel");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: Object,
  },
  // Define the items array
  items: [
    {
      name: String,
      expiryDate: String,
      purchaseDate: String,
      quantity: String,
      description: String,
    },
  ],
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare the entered password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
