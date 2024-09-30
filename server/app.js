const express = require("express");
const mongoose = require("mongoose");
const vision = require("@google-cloud/vision");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/authRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const userRoutes = require("./src/routes/userRoutes");
const { protect } = require("./src/controllers/authController");
const FindProducts = require("./src/utils/ocrUtils");

dotenv.config();

const app = express();

// Google Cloud Vision client setup
const client = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.FOODXP_SERVICEACCOUNT),
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error: ", err));

// Middleware
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/auth", authRoutes);
app.use("/items", protect, itemRoutes);
app.use("/notifications", protect, notificationRoutes);
app.use("/user", protect, userRoutes);

// OCR Endpoint for Image Upload
app.post("/upload-image", async (req, res) => {
  try {
    const { image } = req.body;
    const [result] = await client.textDetection({ image: { content: image } });
    const detections = result.textAnnotations;

    if (detections.length > 0) {
      res.json({ products: await FindProducts(detections) });
    } else {
      res.status(404).json({ message: "No text detected" });
    }
  } catch (error) {
    console.error("Error during OCR processing: ", error);
    res.status(500).json({ message: "Failed to process image" });
  }
});

// Start the server
const PORT = process.env.PORT || 3145;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
