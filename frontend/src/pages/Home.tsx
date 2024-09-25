// src/pages/Home.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import Navbar from "../components/Navbar";

export const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar toggleDropdown={toggleDropdown} showDropdown={showDropdown} />

      <main className="flex-grow container mx-auto p-4">
        {/* Render child routes here */}
        <Outlet />
      </main>
    </div>
  );
};
