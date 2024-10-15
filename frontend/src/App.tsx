import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { CompleteProfile } from "./pages/CompleteProfile";
import { Home } from "./pages/Home";
import { FeedPage } from "./pages/FeedPage";
import { Profile } from "./pages/Profile";
import { Message } from "./pages/Message";
import { useState, useEffect } from "react";
import { jwtDecode }from "jwt-decode"; // Ensure you install jwt-decode
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

interface TokenPayload {
  id: number; // Adjust this based on your JWT payload structure
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken); // Set the token state based on localStorage
    setAuthenticated(!!storedToken); // Update authenticated state

    if (storedToken) {
      try {
        const decodedToken = jwtDecode<TokenPayload>(storedToken);
        const userId = decodedToken.id;
        console.log('User ID:', userId);

        // Check profile completion using axios
        axios.get(`${API}/api/profile/profile-completion-status/${userId}`)
          .then((response) => {
            const isComplete = response.data.isProfileCompleted;
            setProfileCompleted(isComplete);
            setLoading(false); // Set loading to false once the check is complete
          })
          .catch((error) => {
            console.error('Error fetching profile completion status:', error);
            setLoading(false); // Set loading to false on error
          });
      } catch (error) {
        console.error('Error decoding token:', error);
        setLoading(false); // Set loading to false if there's an error in decoding
      }
    } else {
      setLoading(false); // Set loading to false if no token found
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

  if (loading) {
    return <div>Loading...</div>; // Display a loading message or spinner while checking the profile completion
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={authenticated ? (
            profileCompleted ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/complete-profile" />
            )
          ) : (
            <Landing onAuthChange={handleAuthChange} />
          )}
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

        {/* Redirect to home if route doesn't match */}
        <Route path="*" element={<Navigate to={authenticated ? "/home" : "/"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
