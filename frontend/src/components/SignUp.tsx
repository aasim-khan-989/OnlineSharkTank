import React, { useState } from 'react';
import { signUp } from '../api'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

interface SignupProps {
  onSwitch: () => void;
  onAuthChange: (isAuthenticated: boolean, isProfileCompleted: boolean) => void; // New prop for auth change
}

const Signup: React.FC<SignupProps> = ({ onSwitch, onAuthChange }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // For error messages

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await signUp(username, email, password);
      console.log('Sign Up Success:', response);
      localStorage.setItem('token', response.token);
      onAuthChange(true, false); // Set authenticated to true and profile completed to false
      const navigate = useNavigate()
      navigate('/complete-profile')
      // window.location.href = '/complete-profile'; // Redirect to complete profile after signing up
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.'); // Adjust based on your error handling
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-2">Username:</label>
        <input
          type="text"
          className="border rounded p-2 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-2">Email:</label>
        <input
          type="email"
          className="border rounded p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-2">Password:</label>
        <input
          type="password"
          className="border rounded p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded">Sign Up</button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      <p className="mt-2 text-center">
        Already have an account? <button type="button" className="underline text-blue-900" onClick={onSwitch}>Sign In</button>
      </p>
    </form>
  );
};

export default Signup;
