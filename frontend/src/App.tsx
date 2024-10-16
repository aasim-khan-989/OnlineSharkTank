import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { CompleteProfile } from "./pages/CompleteProfile";
import { Home } from "./pages/Home";
import { FeedPage } from "./pages/FeedPage";
import { Profile } from "./pages/Profile";
import { Message } from "./pages/Message";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure you install jwt-decode
import axios from "axios";
import Navbar from "./components/Navbar"; // Import the Navbar component

const API = import.meta.env.VITE_API_URL;

interface TokenPayload {
  id: number; // Adjust this based on your JWT payload structure
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // New state for dropdown
  const [profilePictureUrl, setProfileImageUrl] = useState<string | null>(null);
  // Toggles the dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setAuthenticated(!!storedToken);

    if (storedToken) {
      try {
        const decodedToken = jwtDecode<TokenPayload>(storedToken);
        const userId = decodedToken.id;
        console.log(userId)

        axios
          .get(`${API}/api/profile/profile-completion-status/${userId}`)
          .then((response) => {
            setProfileCompleted(response.data.isProfileCompleted);
            setProfileImageUrl(response.data.profilePictureUrl); 
            // Set the profile image URL here
            console.log(profilePictureUrl);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching profile completion status:", error);
            setLoading(false);
          });
      } catch (error) {
        console.error("Error decoding token:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuthChange = (isAuthenticated: boolean, isProfileCompleted: boolean) => {
    setAuthenticated(isAuthenticated);
    setProfileCompleted(isProfileCompleted);
    if (isAuthenticated) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setProfileCompleted(false);
    setToken(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {/* Conditionally render Navbar only if authenticated */}
      {authenticated && (
        <Navbar toggleDropdown={toggleDropdown} showDropdown={showDropdown} onLogout={onLogout} profilePictureUrl= {profilePictureUrl}/>
      )}
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              profileCompleted ? (
                <Navigate to="/home" />
              ) : (
                <Navigate to="/complete-profile" />
              )
            ) : (
              <Landing onAuthChange={handleAuthChange} />
            )
          }
        />

        <Route
          path="/complete-profile"
          element={
            authenticated && !profileCompleted ? (
              <CompleteProfile onAuthChange={handleAuthChange} />
            ) : (
              <Navigate to={authenticated ? "/home" : "/"} />
            )
          }
        />

        <Route
          path="/home"
          element={
            authenticated && profileCompleted ? (
              <Home />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element={<FeedPage />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Message />} />
        </Route>

        <Route path="*" element={<Navigate to={authenticated ? "/home" : "/"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
