import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const  CompleteProfile: React.FC<{ onAuthChange: (isAuthenticated: boolean, isProfileCompleted: boolean) => void }> = ({ onAuthChange }) => {
  const [name, setName] = useState('');
  const [yearOfPassing, setYearOfPassing] = useState('');
  const [description, setDescription] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate fields
    if (!name || !yearOfPassing || !description || !aadharNumber) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Here, you would typically send the data to your backend.
      // Assuming we have an API endpoint for updating user profile
      const response = await updateProfile({ name, yearOfPassing, description, aadharNumber });
      console.log('Profile Updated:', response);

      // Update authentication state to indicate profile completion
      onAuthChange(true, true); // Set authenticated state and profile completed state
      navigate('/home'); // Redirect to the home page after completing the profile
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-11/12 max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Year of Passing</label>
          <input
            type="text"
            value={yearOfPassing}
            onChange={(e) => setYearOfPassing(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Aadhar Number</label>
          <input
            type="text"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Complete Profile</button>
      </form>
    </div>
  );
};

// Simulate an API call
const updateProfile = async (data: { name: string; yearOfPassing: string; description: string; aadharNumber: string }) => {
  // Simulate a successful API response after 2 seconds
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 2000);
  });
};


