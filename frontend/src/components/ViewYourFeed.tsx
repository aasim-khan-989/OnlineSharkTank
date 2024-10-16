import React, { useState, useEffect } from "react";
import axios from "axios";

interface ViewYourFeedProps {
  userId: number | null;
}

export const ViewYourFeed: React.FC<ViewYourFeedProps> = ({ userId }) => {
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserFeeds = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/my-feeds/${userId}`);
          console.log("API response:", response.data); // Add this to check if data is as expected

          // Check if response data is an array of URLs
          const validUrls = response.data.map((item: { videoUrl: string }) => item.videoUrl);
          setYoutubeUrls(validUrls);
        } catch (error) {
          console.error("Error fetching user feeds:", error);
        }
      }
    };

    fetchUserFeeds();
  }, [userId]);

  // Function to convert regular YouTube URL into embeddable YouTube URL
  const getEmbedUrl = (url: string) => {
    if (typeof url !== "string" || !url) {
      console.error("Invalid URL, expected a valid string:", url); // Debugging line
      return null;
    }
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">My Feed</h3>
      {youtubeUrls.length > 0 ? (
        youtubeUrls.map((url, index) => {
          const embedUrl = getEmbedUrl(url);
          return embedUrl ? (
            <div key={index} className="mt-2">
              <iframe
                width="560"
                height="315"
                src={embedUrl}
                title={`YouTube video ${index + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <p key={index}>Invalid YouTube URL</p>
          );
        })
      ) : (
        <p>No videos available</p>
      )}
    </div>
  );
};
