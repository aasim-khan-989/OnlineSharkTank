// src/components/Landing.tsx
import React, { useState } from 'react';
import Signup from "../components/SignUp";
import Signin from '../components/SignIn';
import backgroundImage from '../assets/shaking_hands.jpg'; // Ensure this path is correct

interface LandingProps {
  onAuthChange: (isAuthenticated: boolean, isProfileCompleted: boolean) => void; // Define the prop type

}

export const Landing: React.FC<LandingProps> = ({ onAuthChange }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [formAnimation, setFormAnimation] = useState('animate__fadeIn'); // State to control animation class

  const toggleForm = (signUp: boolean) => {
    setFormAnimation('animate__fadeOut'); // Set fade-out animation before switching forms
    
    // Switch form after a short delay to allow animation to complete
    setTimeout(() => {
      setIsSigningUp(signUp); // Update the state based on button clicked
      setFormAnimation('animate__fadeIn'); // Reset animation for the next form
    }, 300); // Match this delay with the duration of the fadeOut animation
  };

  return (
    <div 
      className="relative flex justify-center items-center min-h-screen bg-gray-100" 
      style={{ 
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-10"></div>

      {/* Main Container */}
      <div className="relative z-10 bg-white bg-opacity-10 shadow-md rounded-lg p-6 w-11/12 max-w-md transition-all transform">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Welcome to Online Shark Tank</h1>
        
        {/* Button Container */}
        <div className="flex justify-center space-x-4 mb-4">
          <button 
            className={`py-2 px-4 rounded ${isSigningUp ? 'bg-gray-300 text-gray-600' : 'bg-blue-500 text-white'}`} 
            onClick={() => toggleForm(false)} // Directly call toggleForm with false for Sign In
          >
            Sign In
          </button>
          <button 
            className={`py-2 px-4 rounded ${isSigningUp ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`} 
            onClick={() => toggleForm(true)} // Directly call toggleForm with true for Sign Up
          >
            Sign Up
          </button>
        </div>

        {/* Form Animation */}
        <div className={`animate__animated ${formAnimation}`}>
          {isSigningUp 
            ? <Signup onSwitch={() => toggleForm(false)} onAuthChange={onAuthChange} /> 
            : <Signin onSwitch={() => toggleForm(true)} onAuthChange={onAuthChange} />}
        </div>
      </div>
    </div>
  );
};
