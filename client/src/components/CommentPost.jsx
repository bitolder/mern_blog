import { useEffect, useState } from "react";
import moment from "moment";
export default function CommentPost({ comment }) {
  const [userWhoCommented, setUserWhoCommented] = useState([]);

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
  return (
    <div className="flex p-4 border-b dark:border-gray-600">
      <div className="flex-shrink-0 mr-3 ">
        <img
          className="w-10 h-10 bg-gray-200 rounded-full"
          src={userWhoCommented.profilePicture}
          alt={userWhoCommented.username}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center mb-1">
          <span className="font-bold text-xs truncat mr-1">
            @{userWhoCommented.username}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <div>
          <p className="text-gray-500  text-sm pb-2 dark:text-gray-400">
            {comment.comment}
          </p>
        </div>
      </div>
    </div>
  );
}
