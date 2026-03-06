// routes/posts.js
import express from "express";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import verifyToken from "../verifyToken.js";

const router = express.Router();

// CREATE POST
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      photo: req.body.photo
    });

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE POST
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json("Post not found");

    // Only owner can update
    if (post.userId !== req.body.userId)
      return res.status(403).json("You can update only your post");

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE POST
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json("Post not found");

    // Only owner can delete
    if (post.userId !== req.body.userId)
      return res.status(403).json("You can delete only your post");

    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });

    res.status(200).json("Post has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POSTS BY USER
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL POSTS OR SEARCH POSTS
router.get("/", async (req, res) => {
  const query = req.query;

  try {
    let posts;
    if (query.search) {
      posts = await Post.find({
        title: { $regex: query.search, $options: "i" },
      });
    } else {
      posts = await Post.find();
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET SINGLE POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;