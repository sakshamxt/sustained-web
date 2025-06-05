// src/lib/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or however you plan to store the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error handling (optional, can be expanded)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Example: Handle unauthorized errors, e.g., token expired
      // localStorage.removeItem('authToken');
      // localStorage.removeItem('authUser'); // Or clear user from your auth store
      // You might want to use your auth store's logout function here
      // window.location.href = '/login'; // Force redirect to login
      console.error("Unauthorized request or token expired. Redirecting to login might be needed.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;