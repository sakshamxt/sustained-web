// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '@/lib/api'; // Your configured axios instance

// Helper to get initial state from localStorage
const getInitialUser = () => {
  try {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing authUser from localStorage", error);
    return null;
  }
};
const getInitialToken = () => localStorage.getItem('authToken');

const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(), // True if token exists
  isLoading: false, // Global loading state for auth operations
  error: null,      // To store any auth-related errors

  // Internal helper to set user and token, updates localStorage and apiClient defaults
  _setUserAndToken: (userData, authToken) => {
    localStorage.setItem('authUser', JSON.stringify(userData));
    localStorage.setItem('authToken', authToken);
    if (apiClient) { // Ensure apiClient is defined
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }
    set({ user: userData, token: authToken, isAuthenticated: true, error: null, isLoading: false });
  },

  // Internal helper to clear user and token
  _clearUserAndToken: () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    if (apiClient) { // Ensure apiClient is defined
        delete apiClient.defaults.headers.common['Authorization'];
    }
    set({ user: null, token: null, isAuthenticated: false, error: null, isLoading: false });
  },

  // Action to update only the user object (e.g., after profile edit)
  setUser: (userData) => {
    if (userData) {
      localStorage.setItem('authUser', JSON.stringify(userData)); // Keep localStorage in sync
      set((state) => ({
        user: { ...state.user, ...userData }, // Merge with existing user data if necessary, or replace
        error: null,
      }));
    }
  },

  // Register User Action
  registerUser: async (formData) => { // formData is expected to be FormData
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', formData, {
        headers: {
          // Axios will set Content-Type to multipart/form-data automatically
          // if data is FormData. Explicitly setting it can sometimes cause issues.
          // So, let Axios handle it or ensure it's correctly set if overriding.
        }
      });
      // Assuming backend returns { user: {...}, token: "..." }
      const { user, token } = response.data;
      get()._setUserAndToken(user, token);
      return { success: true, user };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // Login User Action
  loginUser: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', credentials);
      // Assuming backend returns { user: {...}, token: "..." }
      const { user, token } = response.data;
      get()._setUserAndToken(user, token);
      return { success: true, user };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // Logout User Action
  logoutUser: () => {
    // Optionally, you could make an API call to a /auth/logout endpoint here
    // e.g., await apiClient.post('/auth/logout');
    // For client-side only logout:
    get()._clearUserAndToken();
    // No need to return anything or handle success/error for client-side logout
  },

  // Fetch/Refresh User Profile (e.g., on app load or after certain actions)
  // This is crucial for getting updated enrolledCourses and progressBySdg
  fetchUserProfile: async (forceFetch = false) => {
    const currentState = get();
    // Fetch if authenticated and:
    // 1. User data is completely missing OR
    // 2. User data is present but considered "incomplete" (e.g., missing progressBySdg) OR
    // 3. forceFetch is true
    const shouldFetch = currentState.isAuthenticated && 
                        (forceFetch || !currentState.user || !currentState.user.progressBySdg); 
                        // Add other checks for "incompleteness" if needed, e.g., !currentState.user.points

    if (!shouldFetch) {
      return { success: currentState.isAuthenticated && !!currentState.user, user: currentState.user, error: null };
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/users/me');
      // Assuming backend returns the user object directly, or nested like { user: {...} }
      const userData = response.data.user || response.data; 
      
      // Update the user in the store and localStorage
      localStorage.setItem('authUser', JSON.stringify(userData));
      set({ user: userData, isLoading: false, error: null });
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch user profile.';
      console.error("Fetch User Profile error:", err);
      // If fetching profile fails (e.g., token is invalid), it's often good to log the user out.
      if (err.response?.status === 401 || err.response?.status === 403) {
        get()._clearUserAndToken(); // Token might be invalid, so clear auth state
      }
      set({ isLoading: false, error: errorMsg, user: null }); // Clear user on fetch failure if appropriate
      return { success: false, error: errorMsg };
    }
  },
}));

// Initialize apiClient Authorization header if token exists on load
// This handles the case where the app is refreshed and apiClient is re-created.
const initialToken = useAuthStore.getState().token;
if (initialToken && apiClient) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export default useAuthStore;