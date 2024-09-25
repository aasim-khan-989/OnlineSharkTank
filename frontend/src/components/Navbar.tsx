// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  toggleDropdown: () => void;
  showDropdown: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDropdown, showDropdown }) => {
  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between flex-wrap">
      {/* Logo with more space */}
      <Link to="/home" className="text-white text-2xl font-bold mr-4">
        Online Shark Tank
      </Link>

      {/* Search Bar and Filter Button */}
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

      {/* Desktop Navigation */}
      <div className="flex items-center">
        {/* Home Button */}
        <Link to="/home/feed" className="text-white mx-2">Home</Link>
        {/* Messages Button */}
        <Link to="/home/messages" className="text-white mx-2">Messages</Link>
        {/* Profile Icon with Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="text-white mx-2">Profile</button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20">
              <Link to="/home/profile" className="block px-4 py-2 text-gray-800" onClick={() => toggleDropdown()}>Profile</Link>
              <button className="block w-full text-left px-4 py-2 text-gray-800">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
