import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import postRoute from "./routes/posts.js";
import commentRoute from "./routes/comments.js";
import uploadRoute from "./routes/upload.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

// Middlewares
app.use(express.json());
app.use(cors({ origin: "https://mern-blogging-ten.vercel.app", credentials: true }));
app.use(cookieParser());

// Serve static files
app.use("/images", express.static(path.join(__dirname, "public/images")));
// Serve static images
//app.use("/images", express.static(path.join(__dirname, "public/images")));

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
// Mount upload route
app.use("/api", uploadRoute); // ✅ This is critical
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
