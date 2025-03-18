import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadStory, resetUploadSuccess } from '../../../actions/StoryActions';
import { FaTimes, FaCloudUploadAlt, FaImage } from "react-icons/fa";

const UploadStory = ({ onClose, isDarkMode, onUploadSuccess }) => {
  const dispatch = useDispatch();
  const [mediaPreview, setMediaPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  
  const { loading, success, error: uploadError } = useSelector((state) => state.storyUpload);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'video/mp4'].includes(selectedFile.type)) {
      setError("Please select an image (JPG, PNG, GIF) or video (MP4) file.");
      return;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB.");
      return;
    }
    
    setFile(selectedFile);
    setError("");
    
    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };
 
  // Trigger file input click
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };
 
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    
    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("media", file);
    
    // Dispatch upload action
    dispatch(uploadStory(formData));
  };
 
  // Handle successful upload
  useEffect(() => {
    if (success) {
      setFile(null);
      setMediaPreview(null);
      
      // Call success callback to close modal and refresh stories
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
      // Reset the success state in Redux to prevent infinite loops
      dispatch(resetUploadSuccess());
    }
  }, [success, onUploadSuccess, dispatch]);
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div 
        className={`w-full max-w-md p-4 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Story</h2>
          <button 
            onClick={onClose}
            className="text-xl"
            aria-label="Close upload modal"
          >
            <FaTimes />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        
        {uploadError && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {uploadError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* File preview area */}
          <div 
            className={`mb-4 p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${
              isDarkMode 
                ? "border-gray-600 bg-gray-700" 
                : "border-gray-300 bg-gray-50"
            }`}
            style={{ minHeight: "200px" }}
          >
            {mediaPreview ? (
              <div className="relative w-full">
                {file.type.startsWith('image/') ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="max-h-60 mx-auto rounded"
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    controls 
                    className="max-h-60 w-full mx-auto rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setMediaPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1"
                  aria-label="Remove file"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <>
                <FaImage className="text-5xl mb-2 text-gray-400" />
                <p className={isDarkMode ? "text-gray-300" : "text-gray-500"}>
                  Select an image or video to share as your story
                </p>
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
                >
                  <FaCloudUploadAlt className="mr-2" />
                  Choose File
                </button>
              </>
            )}
            
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,video/mp4"
              className="hidden"
            />
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`mr-2 px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? "bg-gray-700 text-white" 
                  : "bg-gray-200 text-gray-800"
              }`}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>Share to Story</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadStory;