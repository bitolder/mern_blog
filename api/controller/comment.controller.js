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
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(handleError(404, "Comment not found"));
    const UserIndex = comment.likes.indexOf(req.user.id);
    if (UserIndex === -1) {
      comment.likes.push(req.user.id);
      comment.numberOfLikes += 1;
    } else {
      comment.likes.splice(UserIndex, 1);
      comment.numberOfLikes -= 1;
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
export const editComment = async (req, res, next) => {
  try {
    const commentToEdit = await Comment.findById(req.params.commentId);
    if (!commentToEdit) return next(handleError(404, "Comment not found"));
    if (commentToEdit.userId !== req.user.id && !req.user.isAdmin)
      return next(handleError(403, "Unauthorized to edit this comment"));
    await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        $set: { comment: req.body.comment },
      },
      { new: true }
    );
    res.status(200).json(commentToEdit);
  } catch (error) {
    next(error);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    const commentToDelete = await Comment.findById(req.params.commentId);
    if (!commentToDelete) return next(handleError(404, "Comment not found"));
    if (commentToDelete.userId !== req.user.id && !req.user.isAdmin)
      return next(handleError(403, "Unauthorized to delete this comment"));
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment deleted successfully");
  } catch (error) {
    next(error);
  }
};
