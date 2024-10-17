// src/pages/ViewYourFeed.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Feed {
  id: number; // Add id to the Feed interface
  content: string | null;
  videoUrl: string | null;
  likes: number; // Add likes property
  dislikes: number; // Add dislikes property
}

interface ViewYourFeedProps {
  userId: number | null;
}

export const ViewYourFeed: React.FC<ViewYourFeedProps> = ({ userId }) => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [editFeedId, setEditFeedId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  useEffect(() => {
    const fetchUserFeeds = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/my-feeds/${userId}`);
          console.log("API response:", response.data);
          setFeeds(response.data);
        } catch (error) {
          console.error("Error fetching user feeds:", error);
        }
      }
    };

    fetchUserFeeds();
  }, [userId]);

  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  };

  const handleEdit = (feed: Feed) => {
    setEditFeedId(feed.id);
    setEditContent(feed.content || ""); // Set the content to be edited
  };

  const handleUpdate = async () => {
    if (editFeedId) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/feed/update/${editFeedId}`, { content: editContent });
        // Update local state with the new content
        setFeeds(prevFeeds =>
          prevFeeds.map(feed => (feed.id === editFeedId ? { ...feed, content: editContent } : feed))
        );
        setEditFeedId(null); // Reset edit state
        setEditContent("");
        console.log("Post updated successfully");
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  const handleDelete = async (feedId: number) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/feed/delete/${feedId}`;
      await axios.delete(url);
      // Update local state to remove the deleted feed
      setFeeds(prevFeeds => prevFeeds.filter(feed => feed.id !== feedId));
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">My Feed</h3>
      {feeds.length > 0 ? (
        feeds.map((feed) => {
          const embedUrl = getEmbedUrl(feed.videoUrl);
          return (
            <div key={feed.id} className="mt-2 relative">
              <div className="relative">
                {embedUrl ? (
                  <iframe
                    width="560"
                    height="315"
                    src={embedUrl}
                    title={`YouTube video ${feed.id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <p>Invalid YouTube URL</p>
                )}
                <p className="mt-2">{feed.content}</p>
                {/* Show likes and dislikes */}
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <span>{feed.likes} Likes</span> | <span>{feed.dislikes} Dislikes</span>
                  </div>
                </div>
                {/* Edit and Delete buttons */}
                <div className="flex mt-2">
                  <button
                    onClick={() => handleEdit(feed)}
                    className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(feed.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Edit input field when editing */}
              {editFeedId === feed.id && (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="border p-2 w-full"
                    rows={3}
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-2 py-1 rounded mt-2"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>No videos available</p>
      )}
    </div>
  );
};
