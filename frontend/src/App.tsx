import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { CompleteProfile } from "./pages/CompleteProfile";
import { Home } from "./pages/Home";
import { FeedPage } from "./pages/FeedPage";
import { Profile } from "./pages/Profile";
import { Message } from "./pages/Message";
import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken); // Set the token state based on localStorage
    setAuthenticated(!!storedToken); // Update authenticated state
    if (storedToken) {
      setProfileCompleted(isProfileComplete()); // Check if the profile is complete
    }
  }, []);

  const isProfileComplete = (): boolean => {
    // Replace this with your actual logic to check if the profile is complete
    return false; // Change to true when the profile is complete
  };

  const handleAuthChange = (isAuthenticated: boolean, isProfileCompleted: boolean) => {
    setAuthenticated(isAuthenticated);
    setProfileCompleted(isProfileCompleted);
    if (isAuthenticated) {
      // If authenticated, set the token in local storage
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  };

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
              <CompleteProfile onAuthChange={handleAuthChange} isProfile />
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
