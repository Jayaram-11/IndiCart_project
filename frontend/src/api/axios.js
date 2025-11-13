import axios from 'axios';

// 1. Get the base URL from Vercel's environment variables
//    It falls back to localhost:5000 for local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 2. Create a "custom" axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 👈 CRITICAL: This tells axios to send cookies!
});

// 3. Export it so other files can use it
export default axiosInstance;