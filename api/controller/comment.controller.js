import Comment from "../models/comment.model.js";
import { handleError } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  const { userId, postId, comment } = req.body;
  if (req.user.id != userId)
    return next(handleError(401, "Unauthorized to create a comment"));
  if (!postId || !comment)
    return next(handleError(401, "Unauthorized to create a comment"));
  try {
    const newComment = new Comment({ userId, postId, comment });
    const savedcomment = await newComment.save();
    res.status(201).json(savedcomment);
  } catch (error) {
    next(error);
  }
};
export const getCommentPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
