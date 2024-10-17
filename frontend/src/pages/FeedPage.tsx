import React, { useState, useEffect } from "react";
import axios from "axios";

interface Feed {
  id: number;
  user: {
    username: string;
  };
  content: string | null;
  videoUrl: string | null;
  likes: number;
  dislikes: number;
  isPrivate: boolean;
}

export const FeedPage: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [clickedFeeds, setClickedFeeds] = useState<Set<number>>(new Set());

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
    if (clickedFeeds.has(feedId)) return; // Prevent multiple clicks
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
      setClickedFeeds((prev) => new Set(prev).add(feedId)); // Mark feed as liked
    } catch (error) {
      console.error("Error liking feed:", error);
    }
  };

  const handleDislike = async (feedId: number) => {
    if (clickedFeeds.has(feedId)) return; // Prevent multiple clicks
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
      setClickedFeeds((prev) => new Set(prev).add(feedId)); // Mark feed as disliked
    } catch (error) {
      console.error("Error disliking feed:", error);
    }
  };

  return (
    <div className="mt-4 flex justify-center">
      <div className="w-full max-w-3xl">
        <h3 className="text-3xl font-semibold text-center mb-8 text-blue-600">All Users' Feeds</h3>
        {feeds.length > 0 ? (
          feeds.map((feed) => {
            const embedUrl = getEmbedUrl(feed.videoUrl);
            return (
              <div key={feed.id} className="mt-6 border border-gray-300 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                {/* Display the user's name on the left side */}
                <h4 className="text-xl font-bold mb-2 text-gray-800">{feed.user.username || "Anonymous"}</h4>

                {embedUrl ? (
                  <iframe
                    width="100%"
                    height="315"
                    src={embedUrl}
                    title={`YouTube video ${feed.id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <p className="text-center text-gray-600">No video available</p>
                )}

                <p className="mt-2 text-gray-700">{feed.content || "No content available"}</p>

                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handleLike(feed.id)}
                    disabled={clickedFeeds.has(feed.id)} // Disable if already clicked
                    className={`mr-2 ${clickedFeeds.has(feed.id) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-5 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}
                  >
                    Like ({feed.likes})
                  </button>
                  <button
                    onClick={() => handleDislike(feed.id)}
                    disabled={clickedFeeds.has(feed.id)} // Disable if already clicked
                    className={` ${clickedFeeds.has(feed.id) ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white px-5 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}
                  >
                    Dislike ({feed.dislikes})
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No feeds available</p>
        )}
      </div>
    </div>
  );
};
