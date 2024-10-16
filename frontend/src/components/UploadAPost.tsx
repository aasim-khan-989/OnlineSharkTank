import React, { useState } from "react";
import axios from "axios";

export const UploadAPost: React.FC<{ userId: number }> = ({ userId }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/profile/feed/upload-video`, {
        userId,
        videoUrl,
        content,
        isPrivate,
      });

      if (response.status === 201) {
        alert("Post uploaded successfully!");
        // Reset fields after successful upload
        setVideoUrl("");
        setContent("");
        setIsPrivate(false);
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Failed to upload post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-post-container">
      <h2 className="text-lg font-bold mb-4">Upload a Post</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">YouTube Video URL</label>
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Post Content</label>
        <textarea
          placeholder="Add content to your post"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="checkbox"
          />
          <span className="ml-2">Private Post</span>
        </label>
      </div>

      <button
        onClick={handleUpload}
        className={`btn-primary ${loading ? "opacity-50" : ""}`}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Post"}
      </button>
    </div>
  );
};
