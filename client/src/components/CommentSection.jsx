import { Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CommentPost from "./CommentPost";
import { set } from "mongoose";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState([]);
  const [commentPost, setCommentPost] = useState([]);

  const handleLike = async (commentId) => {
    if (!currentUser) return;
    console.log(commentId);
    try {
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        // setCommentPost(data);
        setCommentPost(
          commentPost.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/comment/createComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser._id,
          postId,
          comment,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setComment("");
        setCommentPost([data, ...commentPost]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditComment = async (comment, editCommentContent) => {
    console.log(comment);

    setCommentPost(
      commentPost.map((c) =>
        c._id === comment._id ? { ...c, comment: editCommentContent } : c
      )
    );
  };
  const handleDeleteComment = (deletedComment) => {
    setCommentPost(commentPost.filter((comm) => deletedComment !== comm._id));
  };
  useEffect(() => {
    const fetchgetCommentPost = async () => {
      const res = await fetch(`/api/comment/getCommentPost/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setCommentPost(data);
      }
    };
    fetchgetCommentPost();
  }, [postId]);

  return (
    <div className="p-12 flex flex-col">
      <div>
        {currentUser ? (
          <div>
            <div className="flex gap-2 items-center">
              <span className="text-gray-400">Signed in as:</span>
              <div className="flex items-center gap-2">
                <img
                  className="w-7 h-7 rounded-full object-cover flex-shrink"
                  src={currentUser.profilePicture}
                  alt={currentUser.username}
                />
                <Link
                  className="text-blue-500 flex-1"
                  to="/dashboard?tab=profile"
                >
                  <span>@{currentUser.username}</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 my-5">
            <span className="text-teal-500">
              You must be logged in to comment.{" "}
            </span>
            <Link className="text-blue-500" to="/sign-in">
              Login
            </Link>
          </div>
        )}
      </div>
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            onChange={(e) => setComment(e.target.value)}
            maxLength={200}
            value={comment}
            placeholder="Add a comment..."
          />
          <div className="flex justify-between items-center mt-5">
            <span className="text-xs text-gray-400">
              {200 - comment.length} characters remaining
            </span>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
      {commentPost.length === 0 ? (
        <p className="my-5 text-sm">No comment yes ! </p>
      ) : (
        <>
          <div className="flex text-sm my-5 items-center gap-1">
            <p>Comments</p>
            <div className=" flex border  py-1 px-2 rounded-sm">
              <p>{commentPost.length}</p>
            </div>
          </div>
          {commentPost.map((comment) => {
            return (
              <CommentPost
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
