import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts, setComments } from "../../../reducers/PostReducers";
import Comment from "./Comment";
import UseGetAllComments from "./UseGetAllComments";
import "./CommentDialog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faShare, faCircleDot, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FaPaperPlane } from "react-icons/fa";
const getRelativeTime = (createdAt) => {
  const currentTime = new Date();
  const postTime = new Date(createdAt);
  const diffInSeconds = Math.floor((currentTime - postTime) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

  // Format date as '2 Jan' or '2 Jan 2025' if not the current year
  const options = { day: 'numeric', month: 'short' };
  const formattedDate = postTime.toLocaleDateString('en-US', options);
  
  if (postTime.getFullYear() !== currentTime.getFullYear()) {
    return `${formattedDate} ${postTime.getFullYear()}`;
  }

  return formattedDate;
};

const CommentDialog = ({ open, setOpen }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { comments, posts, selectedPost } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const dialogRef = useRef(null);
  const commentsEndRef = useRef(null);
  const [slideDirection, setSlideDirection] = useState("none");
  const [liked, setLiked] = useState(selectedPost?.likes?.includes(userInfo?._id) || false);
  UseGetAllComments();

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const changeEventHandler = (e) => setText(e.target.value);

  const sendMessageHandler = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/comment/${selectedPost?._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const newComment = res.data.comment;
        dispatch(setComments([...comments, newComment]));
        const updatedPosts = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: [...p.comments, newComment] } : p
        );
        dispatch(setPosts(updatedPosts));
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigatePost = (direction) => {
    const currentIndex = posts.findIndex((p) => p._id === selectedPost?._id);
    if (direction === "next" && currentIndex < posts.length - 1) {
      setSlideDirection("next");
      setTimeout(() => dispatch(setPosts(posts[currentIndex + 1])), 300);
    }
    if (direction === "prev" && currentIndex > 0) {
      setSlideDirection("prev");
      setTimeout(() => dispatch(setPosts(posts[currentIndex - 1])), 300);
    }
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <button
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-3 hover:text-gray-800 hover:bg-opacity-70 text-2xl hover:border-2 hover:border-gray-600"
          onClick={() => setOpen(false)}
        >
          ✖
        </button>
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-white hover:bg-opacity-70 bg-black bg-opacity-50 p-3 hover:border-2 hover:border-gray-600"
          onClick={() => navigatePost("prev")}
        >
          ◀
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl text-white hover:bg-opacity-70 bg-black bg-opacity-50 p-3 hover:border-2 hover:border-gray-600"
          onClick={() => navigatePost("next")}
        >
          ▶
        </button>
        
        <div
          className="bg-white shadow-lg w-full max-w-5xl h-[90vh] flex flex-row relative"
          ref={dialogRef}
        >
          {/* Left Side - Post Image */}
          <div className="w-7/12 h-full flex justify-center items-center bg-black">
            <img
              src={"http://localhost:5000" + selectedPost?.media}
              alt="Post"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Right Side - Post Details & Comments */}
          <div className="w-5/12 flex flex-col h-full">
            {/* User Info Header */}
            <div className="flex items-center p-4 border-b">
              <Link to="#" className="flex items-center">
                <img
                  src={"http://localhost:5000" + selectedPost?.postedBy?.profileImage}
                  alt="avatar"
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-lg">
                  {selectedPost?.postedBy?.username}
                </h4>
                <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faCircleDot}
                className="text-xs flex text-gray-400"/>
                <p className="text-xs flex text-gray-700 ">  {getRelativeTime(selectedPost.createdAt)}</p>
                </div>
                  </div>
                
                <span className="font-normal text-sm text-gray-500">{selectedPost?.postedBy?.jobProfile}</span>
                </div>
                <FontAwesomeIcon icon={faEllipsis}
                className="text-lg ml-40 text-gray-500 bg-gray-200 p-1 rounded-lg px-2"/>

              </Link>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Original Post Caption */}
              <div className="flex mb-4">
                
                  <span className="text-sm">{selectedPost?.caption}</span>
              </div>
              <div className="">
              <div className="flex  gap-4 mb-2">
                <div className="flex flex-col items-center mb-4">
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`cursor-pointer text-2xl ${
                    liked ? 'text-red-600' : 'text-black'
                  }`}
                  onClick={() => setLiked(!liked)}
                />
                <div className="font-semibold text-xs mb-1">
                {selectedPost?.likes?.length} likes
              </div>
                </div>
                <div className="flex flex-col items-center">
                <FontAwesomeIcon
                  icon={faComment}
                  className="cursor-pointer text-2xl"
                />
                <div className="font-semibold text-xs mb-1">
                {selectedPost?.comments?.length} comments
              </div>
                </div>
                <div className="flex flex-col items-center">
                <FontAwesomeIcon
                  icon={faShare}
                  className="cursor-pointer text-2xl"
                />
                </div>
              </div>
            </div>
              {/* Comments */}
              {comments.map((c) => (
                <Comment key={c._id} comment={c} />
              ))}
              <div ref={commentsEndRef} />
            </div>

            {/* Action Buttons */}

            {/* Add Comment Input */}
            <div className="p-4 flex items-center border-t">
              <input
                type="text"
                value={text}
                onChange={changeEventHandler}
                placeholder="Add a comment..."
                className="flex-1 text-sm border-none outline-none"
                onKeyDown={(e) => e.key === "Enter" && sendMessageHandler()}
              />
              <button
                className={`font-semibold ${
                  text.trim() ? 'text-green-500' : 'text-green-200'
                }`}
                disabled={!text.trim()}
                onClick={sendMessageHandler}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CommentDialog;