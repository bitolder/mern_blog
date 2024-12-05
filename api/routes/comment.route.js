import {
  createComment,
  deleteComment,
  editComment,
  getCommentPost,
  likeComment,
} from "../controller/comment.controller.js";
import express from "express";
import { verifyToken } from "../utils/verifyUsers.js";
const router = express.Router();
router.post("/createComment", verifyToken, createComment);
router.get("/getCommentPost/:postId", getCommentPost);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
export default router;
