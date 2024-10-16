import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API = import.meta.env.VITE_API_URL;

export const CompleteProfile: React.FC<{ onAuthChange: (isAuthenticated: boolean, isProfileCompleted: boolean) => void }> = ({ onAuthChange }) => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [description, setDescription] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [investmentCategory, setInvestmentCategory] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!fullName) {
      setError('Full name is required.');
      return;
    }

    try {
      // Get user ID from the token
      const storedToken = localStorage.getItem('token');
      const decodedToken: any = jwtDecode(storedToken!);
      const userId = decodedToken.id;

      // Build the payload dynamically, only including non-empty fields
      const payload: any = { userId, fullName, age: age ? Number(age) : null, aadharNumber };

      if (dateOfBirth) payload.dateOfBirth = new Date(dateOfBirth);
      if (description) payload.description = description;
      if (businessCategory) payload.businessCategory = businessCategory;
      if (investmentCategory) payload.investmentCategory = investmentCategory;
      if (contactNumber) payload.contactNumber = contactNumber;
      if (location) payload.location = location;
      if (profilePictureUrl) payload.profilePictureUrl = profilePictureUrl;
      if (socialLinks) payload.socialLinks = socialLinks;

      // Send the data to your backend API
      const response = await axios.post(`${API}/api/profile/complete-profile`, payload);

      console.log('Profile Updated:', response.data);

      // Update authentication state to indicate profile completion
      onAuthChange(true, true);
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-lg font-semibold mb-2">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-2 w-full max-w-md">
        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Full Name*</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-6 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            required
          />
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Age*</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full h-6 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            required
          />
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full h-6 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-12 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          ></textarea>
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Business Category</label>
          <input
            type="text"
            value={businessCategory}
            onChange={(e) => setBusinessCategory(e.target.value)}
            className="w-full h-6 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Investment Category</label>
          <input
            type="text"
            value={investmentCategory}
            onChange={(e) => setInvestmentCategory(e.target.value)}
            className="w-full h-6 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Contact Number</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full h-6 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full h-6 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Profile Picture URL</label>
          <input
            type="text"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            className="w-full h-6 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Linkedin URL</label>
          <textarea
            value={socialLinks}
            onChange={(e) => setSocialLinks(e.target.value)}
            className="w-full h-12 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          ></textarea>
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-xs mb-0.5">Aadhar Number *</label>
          <input
            type="text"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            className="w-full h-6 px-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        {error && <p className="text-red-500 text-xs mb-1">{error}</p>}
        <button type="submit" className="w-full py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition duration-300 ease-in-out">
          Complete Profile
        </button>
      </form>
    </div>
  );


};
