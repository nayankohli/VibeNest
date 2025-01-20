import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPosts, likePost, deletePost } from '../../../actions/PostActions';
import './DisplayPosts.css';

const DisplayPosts = () => {
  const dispatch = useDispatch();

  const postList = useSelector((state) => state.postList);
  const { posts, loading, error } = postList;
  
  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  if (posts && posts.length > 0) {
    return (
      <div className="display-posts-container">
        <h1>All Posts</h1>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <div className="display-posts-list">
          {posts?.map((post) => (
            <div className="display-posts-card" key={post._id}>
              <div className="display-posts-header">
                <div className="display-posts-profile-image">
                  <img
                    src={post.postedBy.profileImage || "default-profile.jpg"}
                    alt="Profile"
                  />
                </div>
                <div className="display-posts-info">
                  <h4>{post.postedBy.username}</h4>
                  <p>{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="display-posts-body">
                <h3>{post.title}</h3>
                <p>{post.content}</p>

                {post.media && post.media.length > 0 && (
                  <div className="display-posts-media">
                    {post.media.map((mediaItem, index) => (
                      <div key={index} className="media-item">
                        {mediaItem.type === "image" ? (
                          <img src={mediaItem.url} alt="Post media" />
                        ) : mediaItem.type === "video" ? (
                          <video controls>
                            <source src={mediaItem.url} type="video/mp4" />
                          </video>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="display-posts-footer">
                <button onClick={() => handleLike(post._id)}>Like</button>
                <button>Comment</button>
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </div>

              <div className="display-posts-comments-section">
                {post.comments?.map((comment, index) => (
                  <div key={index} className="display-posts-comment">
                    <div className="display-posts-comment-author">
                      <img
                        src={comment.commentedBy.profileImage || "default-profile.jpg"}
                        alt="Commenter"
                      />
                      <p>{comment.commentedBy.username}</p>
                    </div>
                    <p>{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return <div>No posts yet</div>;
  }
};

export default DisplayPosts;
