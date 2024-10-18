import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import defaultProfileIcon from "./profile.png"; // Import default profile icon

interface Profile {
  fullName: string;
  description: string | null;
  profilePictureUrl: string | null;
}

interface Feed {
  id: number;
  content: string | null;
  videoUrl: string | null;
  likes: number;
  dislikes: number;
  isPrivate: boolean;
}

export const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Get userId from URL params
  const [profile, setProfile] = useState<Profile | null>(null);
  const [publicFeeds, setPublicFeeds] = useState<Feed[]>([]);
  const [imageError, setImageError] = useState(false); // State to track image loading error

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${userId}/profile`);
        console.log("Profile data:", response.data);

        // Set profile and public feeds state
        setProfile(response.data.profile);
        setPublicFeeds(response.data.publicFeeds);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Helper function to get the YouTube embed URL
  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  };

  return (
    <div className="mt-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        {/* Profile Info */}
        {profile ? (
          <div className="profile-section mb-8 p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <img
              src={imageError || !profile.profilePictureUrl ? defaultProfileIcon : profile.profilePictureUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-blue-600"
              onError={() => setImageError(true)} // Set imageError state on load error
            />
            <h3 className="text-3xl font-bold text-center mt-4 text-blue-800">{profile.fullName}</h3>
            <p className="text-center text-gray-600 mt-2">
              {profile.description || "This user has no description available."}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading profile...</p>
        )}

        {/* Public Feeds */}
        <h3 className="text-3xl font-semibold text-center mb-6 text-blue-600">User's Public Feeds</h3>
        {publicFeeds.length > 0 ? (
          publicFeeds.map((feed) => {
            const embedUrl = getEmbedUrl(feed.videoUrl);
            return (
              <div
                key={feed.id}
                className="feed-section mb-6 border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
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
                  <p className="text-center text-gray-500">No video available</p>
                )}
                <p className="mt-4 text-gray-700">{feed.content || "No content available"}</p>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No public feeds available</p>
        )}
      </div>
    </div>
  );
};
