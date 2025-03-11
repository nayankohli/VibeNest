import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPosts,setSelectedPost
} from "../../../reducers/PostReducers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart , faComment} from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'
import CommentDialog from "./CommentDialog";
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

  return postTime.toLocaleDateString();
};
const Post=({post})=>{
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { posts, loading, error,comments } = useSelector((store) => store.post);
    const fetchProfileState = useSelector((state) => state.fetchProfile);
      const { profile } = fetchProfileState || {};
      const userLogin = useSelector((state) => state.userLogin);
      const { userInfo } = userLogin;
    const [liked, setLiked] = useState(post.likes.includes(userInfo?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const likeOrDislikeHandler = async () => {
      // Optimistically update UI
      setLiked(!liked);
      setPostLike(liked ? postLike - 1 : postLike + 1);
  
      try {
          const action = liked ? 'dislike' : 'like';
          const res = await axios.get(`http://localhost:5000/api/posts/${post._id}/${action}`, { 
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${userInfo.token}`,
              },
              withCredentials: true
          });
  
          console.log(res.data);
          if (!res.data.success) {
              // If API fails, revert UI changes
              setLiked(liked);
              setPostLike(liked ? postLike + 1 : postLike - 1);
              alert("Failed to update like status.");
          }
      } catch (error) {
          console.error(error);
          // Revert UI in case of an error
          setLiked(liked);
          setPostLike(liked ? postLike + 1 : postLike - 1);
      }
  };
  

    const commentHandler = async () => {

        try {
            const res = await axios.post(`http://localhost:5000/api/posts/comment/${post._id}`, { text }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                withCredentials: true
            });
            console.log(res.data);
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                alert(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/posts/delete/${post?._id}`, { 
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                withCredentials: true
             })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.messsage);
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/posts/${post?._id}/bookmark`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                withCredentials: true
            });
            if(res.data.success){
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div key={post._id} className=" rounded-lg p-5 shadow-md w-full">
              <div className="flex items-center mb-3">
                <div className="mr-3">
                  <img
                    src={
                      "http://localhost:5000" + post.postedBy.profileImage ||
                      "default-profile.jpg"
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                </div>
                <div>
                <h4 className="font-bold text-lg text-gray-900">
                  {post.postedBy.username}
                </h4>
                <p className="text-sm text-gray-500">{post.postedBy.jobProfile}</p>
                </div>
                
              </div>

              <div className="mb-3">
                {post.media && post.media.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {post.media.map((mediaItem, index) => (
                      <div
                        key={index}
                        className="m-2 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                      >
                        {mediaItem.endsWith(".mp4") ? (
                          <video
                            controls
                            className="w-full max-h-96 bg-black object-cover rounded-lg"
                          >
                            <source
                              src={`http://localhost:5000${mediaItem}`}
                              type="video/mp4"
                            />
                          </video>
                        ) : (
                          <img
                            src={`http://localhost:5000${mediaItem}`}
                            alt="Post media"
                            className="w-full max-h-96 bg-gray-100 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-gray-400 pt-3">
                <div className="flex items-center gap-3">
                <FontAwesomeIcon 
    icon={faHeart} 
    onClick={likeOrDislikeHandler} 
    size={'24'} 
    className={`cursor-pointer ${liked ? 'text-red-600' : 'text-gray-600 hover:text-gray-800'}`} 
/>
<p>{postLike}</p>
                  <button className="text-xl text-gray-500 hover:text-blue-500 transition-colors duration-300">
                    <FontAwesomeIcon icon={faComment} onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer hover:text-gray-600'/>
                  </button>
                  <p>{comment.length}</p>
                </div>
                {userInfo?._id === profile?._id && (
                  <button
                    onClick={deletePostHandler}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              {/* <div className="mt-3">
                {post.comments?.map((comment, index) => (
                  <div key={index} className="flex items-center gap-3 mb-2">
                    <img
                      src={
                        comment.commentedBy.profileImage ||
                        "default-profile.jpg"
                      }
                      alt="Commenter"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                    <p>{comment.commentedBy.username}</p>
                  </div>
                ))}
              </div> */}
              <div className="flex items-center gap-3 my-2">
                <p className="font-bold text-gray-900">
                  {post.postedBy.username}
                </p>
                <p className="text-gray-700">{post.caption}</p>
              </div>
              {
                comment.length > 0 && (
                    <span onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer text-sm text-gray-400 p-4 mb-5'>View all {comment.length} comments</span>
                )
            }
            <CommentDialog open={open} setOpen={setOpen} post={post}/>
            <div className='flex items-center gap-2 justify-between mt-2'>
              <div className="rounded-full">
                <img src={"http://localhost:5000"+userInfo.profileImage} alt="" 
                className="rounded-full object-cover w-10 h-10"/>
              </div>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm text-gray-500 w-full bg-gray-100 p-2.5 rounded-lg border '
                />
                {
                    text && <span onClick={commentHandler} onKeyDown={(e) => e.key === "Enter" && commentHandler()} className='text-green-600 cursor-pointer'>Post</span>
                }

            </div>
              <p className="text-sm text-gray-600 mt-3">
                {getRelativeTime(post.createdAt)}
              </p>
            </div>
    )
}
export default Post;