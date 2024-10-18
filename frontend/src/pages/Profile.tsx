// src/pages/Profile.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultProfileIcon from "./profile.png"; // Import default profile icon
import { ViewYourFeed } from "../components/ViewYourFeed";
import { UploadAPost } from "../components/UploadAPost";

interface ProfileProps {
  userId: number | null;
}

export function Profile({ userId }: ProfileProps): JSX.Element {
  const [profileData, setProfileData] = useState({
    fullName: "",
    description: "",
    profilePictureUrl: "",
  });
  const [showUploadComponent, setShowUploadComponent] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/profile-completion-status/${userId}`);
          setProfileData(response.data);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row">
      <div className="flex-shrink-0">
        <img
          src={imageError || !profileData.profilePictureUrl ? defaultProfileIcon : profileData.profilePictureUrl}
          alt="profile"
          className="w-32 h-32 rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="flex-grow mt-4 md:mt-0 md:ml-4">
        <h2 className="text-2xl font-bold">{profileData.fullName || "None"}</h2>
        <p className="text-gray-600">{profileData.description || "None"}</p>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setShowUploadComponent(false)}
            className={`mt-2 bg-green-600 text-white p-2 rounded flex-grow mr-2 ${
              !showUploadComponent ? "opacity-50" : ""
            }`}
          >
            View Your Feed
          </button>
          <button
            onClick={() => setShowUploadComponent(true)}
            className={`mt-2 bg-blue-600 text-white p-2 rounded flex-grow ml-2 ${
              showUploadComponent ? "opacity-50" : ""
            }`}
          >
            Upload a Post
          </button>
        </div>

        {showUploadComponent ? (
          <UploadAPost userId={userId} />
        ) : (
          <ViewYourFeed userId={userId} />
        )}
      </div>
    </div>
  );
}
