const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const register = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ username, password, firstName, lastName });
    await newUser.save();

    const token = GenerateToken(newUser);

    return res
      .status(201)
      .json({ message: "User registered successfully", token: token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = GenerateToken(user);

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error logging in", error: err.message });
  }
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "You are not logged in!" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { register, login, protect };

function GenerateToken(user) {
  return jwt.sign(
    { username: user.username, id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
}
