import React, { useState, useEffect } from "react";
import axios from "axios";

interface Feed {
  id: number; // Add id to the Feed interface
  content: string | null;
  videoUrl: string | null;
  likes: number;
  dislikes: number;
}

interface ViewYourFeedProps {
  userId: number | null;
}

export const ViewYourFeed: React.FC<ViewYourFeedProps> = ({ userId }) => {
  const [feeds, setFeeds] = useState<Feed[]>([]);

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

  const handleLike = async (feedId: number) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/feed/${feedId}/like`;
      console.log("Sending request to:", url);
      const response = await axios.post(url);
      console.log("Like response:", response.data);
      // Update local state to reflect the like
      setFeeds(prevFeeds => prevFeeds.map(feed => 
        feed.id === feedId ? { ...feed, likes: feed.likes + 1 } : feed
      ));
    } catch (error) {
      console.error("Error liking feed:", error);
    }
  };

  const handleDislike = async (feedId: number) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/feed/${feedId}/dislike`;
      console.log("Sending request to:", url);
      const response = await axios.post(url);
      console.log("Dislike response:", response.data);
      // Update local state if needed
      setFeeds(prevFeeds => prevFeeds.map(feed => 
        feed.id === feedId ? { ...feed, dislikes: feed.dislikes + 1 } : feed
      ));
    } catch (error) {
      console.error("Error disliking feed:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">My Feed</h3>
      {feeds.length > 0 ? (
        feeds.map((feedm) => {
          const embedUrl = getEmbedUrl(feedm.videoUrl);
          return (
            <div key={feedm.id} className="mt-2">
              {embedUrl ? (
                <iframe
                  width="560"
                  height="315"
                  src={embedUrl}
                  title={`YouTube video ${feedm.id}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <p>Invalid YouTube URL</p>
              )}
              <p className="mt-2">{feedm.content}</p>
              <div className="flex mt-2">
                <button onClick={() => handleLike(feedm.id)} className="mr-2">
                  Like ({feedm.likes})
                </button>
                <button onClick={() => handleDislike(feedm.id)}>
                  Dislike ({feedm.dislikes})
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p>No videos available</p>
      )}
    </div>
  );
};
