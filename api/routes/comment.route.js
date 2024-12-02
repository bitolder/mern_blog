import {
  createComment,
  getCommentPost,
} from "../controller/comment.controller.js";
import express from "express";
import { verifyToken } from "../utils/verifyUsers.js";
const router = express.Router();
router.post("/createComment", verifyToken, createComment);
router.get("/getCommentPost/:postId", getCommentPost);
export default router;
