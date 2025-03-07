import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories } from "../../../reducers/StorySlice";

const Story = () => {
  const dispatch = useDispatch();
  const { stories, loading, error } = useSelector((state) => state.stories);

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);


  return (
    <div className="flex gap-3 overflow-x-auto p-4">
      {stories.map((story) => (
        <div key={story._id} className="relative">
          <img
            src={story.user.profileImage}
            alt={story.user.username}
            className="w-16 h-16 rounded-full border-2 border-red-500 cursor-pointer"
          />
          <p className="text-xs text-center">{story.user.username}</p>
        </div>
      ))}
    </div>
  );
};

export default Story;
