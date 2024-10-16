import React from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultProfileIcon from "./profile.png"; // Import your local default icon

interface NavbarProps {
  toggleDropdown: () => void;
  showDropdown: boolean;
  onLogout: () => void;
  profilePictureUrl: string | null;
}

const Navbar: React.FC<NavbarProps> = ({
  toggleDropdown,
  showDropdown,
  onLogout,
  profilePictureUrl,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/"); // Redirect to the landing page after logout
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between flex-wrap">
      <Link to="/home" className="text-white text-2xl font-bold mr-4">
        Online Shark Tank
      </Link>

      <div className="flex-grow mx-4 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full md:w-64 p-2 rounded-md"
        />
        <button className="ml-2 p-2 bg-blue-600 text-white rounded-md">
          Filter
        </button>
      </div>

      <div className="flex items-center">
        <Link to="/home/feed" className="text-white mx-2">Home</Link>
        <Link to="/home/messages" className="text-white mx-2">Messages</Link>

        <div className="relative">
          <button onClick={toggleDropdown} className="text-white mx-2 flex items-center">
            <img
              src={profilePictureUrl && profilePictureUrl !== "" ? profilePictureUrl : defaultProfileIcon} // Use default icon if URL is null or empty
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultProfileIcon; // Fallback to default icon if image fails to load
              }}
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20">
              <Link to="/home/profile" className="block px-4 py-2 text-gray-800" onClick={toggleDropdown}>
                Profile
              </Link>
              <button className="block w-full text-left px-4 py-2 text-gray-800" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
