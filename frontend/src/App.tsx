import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {Landing} from "./pages/Landing";
import {CompleteProfile} from "./pages/CompleteProfile";
import {Home} from "./pages/Home";
import {FeedPage} from "./pages/FeedPage";
import {Profile} from "./pages/Profile";
import {Message} from "./pages/Message";
import { isAuthenticated, isProfileComplete } from "./services/auth";
import { useState, useEffect } from "react";

function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated());
  const [profileCompleted, setProfileCompleted] = useState<boolean>(isProfileComplete());

  
  useEffect(() => {
    const checkAuthStatus = () => {
      setAuthenticated(isAuthenticated());
      setProfileCompleted(isProfileComplete());
    };

    checkAuthStatus();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={authenticated ? <Navigate to={profileCompleted ? "/home" : "/complete-profile"} /> : <Landing />} />

        <Route
          path="/complete-profile"
          element={
            authenticated && !profileCompleted ? (
              <CompleteProfile />
            ) : (
              <Navigate to={authenticated ? "/home" : "/"} />
            )
          }
        />

      
        <Route path="/home" element={authenticated && profileCompleted ? <Home /> : <Navigate to="/" />}>

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
