// routes/auth.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json("User not found!");

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(401).json("Wrong credentials!");

    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.SECRET,
      { expiresIn: "3d" }
    );

    const { password, ...info } = user._doc;

    res
      .cookie("token", token, {
         httpOnly: true,
  sameSite: "none",   // required for cross-site
  secure: true        // required for https (Render)
      })
      .status(200)
      .json(info);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
      })
      .status(200)
      .send("User logged out successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// REFETCH USER
router.get("/refetch", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json("No token found");

  jwt.verify(token, process.env.SECRET, {}, (err, data) => {
    if (err) return res.status(401).json("Invalid token");

    res.status(200).json(data);
  });
});

export default router;
