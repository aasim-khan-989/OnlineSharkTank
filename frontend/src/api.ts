import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL // Adjust if your backend URL is different

export const signUp = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/api/auth/signup`, {
    username,
    email,
    password,
  });
  return response.data;
};

export const signIn = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/api/auth/signin`, {
    email,
    password,
  });
  return response.data;
};
