// src/components/SignIn.tsx
import React, { useState } from 'react';
import { signIn } from '../api'; // Adjust the import according to your API handling
import { useNavigate } from 'react-router-dom';

interface SigninProps {
  onSwitch: () => void; // Prop to switch to Signup
  onAuthChange: (isAuthenticated: boolean, isProfileCompleted: boolean) => void; // Added prop
}

const Signin: React.FC<SigninProps> = ({ onSwitch, onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // For error messages

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await signIn(email, password); // Call your sign-in function
      console.log('Sign In Success:', response);
      localStorage.setItem('token', response.token);
      onAuthChange(true, true); // Set as authenticated and profile not yet completed
      const navigate = useNavigate()
      navigate('/home')

    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.'); // Adjust based on your error handling
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
      <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded">Sign In</button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      <p className="mt-2 text-center">
        Don't have an account? <button type="button" className="underline text-blue-900" onClick={onSwitch}>Sign Up</button>
      </p>
    </form>
  );
};

export default Signin;
