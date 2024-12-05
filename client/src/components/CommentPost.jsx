import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Modal, Textarea } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function CommentPost({ comment, onLike, onEdit, onDelete }) {
  const [editComment, setEditComment] = useState(false);
  const [userWhoCommented, setUserWhoCommented] = useState([]);
  const [editCommentContent, setEditCommentContent] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchgetUserWhoCommented = async () => {
      const res = await fetch(`/api/user/${comment.userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserWhoCommented(data);
      }
    };
    fetchgetUserWhoCommented();
  }, [comment._id]);
  const handleChange = () => {
    setEditComment(true);
  };
  const handleChangeComment = (e) => {
    setEditCommentContent(e.target.value);
  };
  const handleSave = async () => {
    if (editCommentContent === "") return;
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: editCommentContent }),
      });
      if (res.ok) {
        onEdit(comment, editCommentContent);
        setEditComment(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteUser = async (commentId) => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      onDelete(commentId);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex p-4 border-b  dark:border-gray-600">
      <div className="flex-shrink-0 mr-3 ">
        <img
          className="w-10 h-10 bg-gray-200 rounded-full"
          src={userWhoCommented.profilePicture}
          alt={userWhoCommented.username}
        />
      </div>

      <div className="flex-1">
        <div className=" flex items-center mb-1">
          <span className="font-bold text-xs truncat mr-1">
            @{userWhoCommented.username}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {editComment ? (
          <>
            <Textarea
              className="mb-2"
              maxLength={200}
              defaultValue={comment.comment}
              onChange={handleChangeComment}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setEditComment(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-gray-500  text-sm pb-2 dark:text-gray-400">
                {comment.comment}
              </p>
            </div>
            <div className="flex gap-2 items-center text-xs border-t max-w-fit dark:bg-gray-700">
              <div
                className={`hover:text-blue-500 text-gray-400 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <button type="button" onClick={() => onLike(comment._id)}>
                  <FaThumbsUp />
                </button>
              </div>

              <span className="text-gray-400 ">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </span>
              {currentUser._id === comment.userId && (
                <>
                  <button
                    type="button"
                    onClick={handleChange}
                    className="text-gray-400"
                  >
                    edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-gray-400"
                  >
                    delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      {showModal && (
        <Modal
          show={showModal}
          popup
          onClose={() => setShowModal(false)}
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-3 text-lg  text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </h3>
              <div className="flex justify-between">
                <Button
                  color="failure"
                  onClick={() => handleDeleteUser(comment._id)}
                >
                  Yes, I'm sure
                </Button>
                <Button color="success" onClick={() => setShowModal(false)}>
                  No, Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
