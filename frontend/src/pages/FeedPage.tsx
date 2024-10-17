import React, { useState, useEffect } from "react";
import axios from "axios";

interface Feed {
  id: number;
  content: string | null;
  videoUrl: string | null;
  likes: number;
  dislikes: number;
  isPrivate: boolean; // Added to handle private posts
}

export const FeedPage: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);

  useEffect(() => {
    const fetchAllFeeds = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/feed/all`);
        console.log("API response:", response.data);

        // Filter out private feeds
        const publicFeeds = response.data.filter((feed: Feed) => !feed.isPrivate);
        setFeeds(publicFeeds);
      } catch (error) {
        console.error("Error fetching all feeds:", error);
      }
    };

    fetchAllFeeds();
  }, []);

  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  };

  const handleLike = async (feedId: number) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/feed/${feedId}/like`;
      const response = await axios.post(url);
      console.log("Like response:", response.data);

      // Update local state to reflect the like
      setFeeds((prevFeeds) =>
        prevFeeds.map((feed) =>
          feed.id === feedId ? { ...feed, likes: feed.likes + 1 } : feed
        )
      );
    } catch (error) {
      console.error("Error liking feed:", error);
    }
  };

  const handleDislike = async (feedId: number) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/feed/${feedId}/dislike`;
      const response = await axios.post(url);
      console.log("Dislike response:", response.data);

      // Update local state to reflect the dislike
      setFeeds((prevFeeds) =>
        prevFeeds.map((feed) =>
          feed.id === feedId ? { ...feed, dislikes: feed.dislikes + 1 } : feed
        )
      );
    } catch (error) {
      console.error("Error disliking feed:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">All Users' Feeds</h3>
      {feeds.length > 0 ? (
        feeds.map((feed) => {
          const embedUrl = getEmbedUrl(feed.videoUrl);
          return (
            <div key={feed.id} className="mt-4 border p-4 rounded-lg shadow">
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
                <p>No video available</p>
              )}

              <p className="mt-2">{feed.content || "No content available"}</p>

              <div className="flex mt-2">
                <button onClick={() => handleLike(feed.id)} className="mr-2 bg-blue-500 text-white px-4 py-1 rounded">
                  Like ({feed.likes})
                </button>
                <button onClick={() => handleDislike(feed.id)} className="bg-red-500 text-white px-4 py-1 rounded">
                  Dislike ({feed.dislikes})
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p>No feeds available</p>
      )}
    </div>
  );
};
