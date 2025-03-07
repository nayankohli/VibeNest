import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="flex shadow-md p-1 mb-3">
      <img
        src={"http://localhost:5000" + comment?.commentedBy?.profileImage}
        alt="Profile"
        className="w-8 h-8 rounded-full mr-3"
      />
      <div>
        <span className="font-semibold text-sm mr-2">
          {comment?.commentedBy?.username}
        </span>
        <span className="text-sm">{comment?.text}</span>
      </div>
    </div>
  );
};

export default Comment;