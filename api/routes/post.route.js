import express from "express";
import { verifyToken } from "../utils/verifyUsers.js";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controller/post.controller.js";
const router = express.Router();
router.post("/create", verifyToken, createPost);
router.get("/getposts", getPosts);
router.delete("/delete/:postId/:userId", verifyToken, deletePost);
router.get("/get/:postId", getPost);
router.put("/update/:postId/:userId", verifyToken, updatePost);
export default router;
