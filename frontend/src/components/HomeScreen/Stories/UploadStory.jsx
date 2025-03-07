import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadStory } from "../../../reducers/StorySlice";

const UploadStory = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleUpload = () => {
    if (!file) return alert("Please select a file");
    dispatch(uploadStory(file));
    setFile(null);
  };

  return (
    <div className="p-4">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2">
        Upload Story
      </button>
    </div>
  );
};

export default UploadStory;
