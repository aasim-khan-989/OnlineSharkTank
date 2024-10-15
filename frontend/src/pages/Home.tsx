// src/pages/Home.tsx
import { Outlet } from "react-router-dom"; // Import Outlet

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4">
        {/* Render child routes here */}
        <Outlet />
      </main>
    </div>
  );
};
