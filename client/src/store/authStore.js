// src/store/authStore.js - FIXED

import { create } from 'zustand';
import apiClient from '@/lib/api'; // Your configured axios instance

/**
 * Safely retrieves the initial user object from localStorage.
 * Handles cases where the item is null, the string "undefined", empty, or invalid JSON.
 */
const getInitialUser = () => {
  try {
    const userString = localStorage.getItem('authUser');

    if (!userString || userString === 'undefined' || userString.trim() === '') {
      if (userString) {
        localStorage.removeItem('authUser');
      }
      return null;
    }
    return JSON.parse(userString);
  } catch (error) {
    console.error("Error processing authUser from localStorage:", error);
    localStorage.removeItem('authUser');
    return null;
  }
};

/**
 * Retrieves the auth token from localStorage.
 */
const getInitialToken = () => localStorage.getItem('authToken');

const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
  isLoading: false,
  error: null,

  /**
   * Internal helper to set user and token in state and localStorage.
   */
  _setUserAndToken: (userData, authToken) => {
    if (userData && typeof userData === 'object' && Object.keys(userData).length > 0 && authToken) {
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', authToken);
      if (apiClient) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      }
      set({ user: userData, token: authToken, isAuthenticated: true, error: null, isLoading: false });
    } else {
      console.error("Attempted to set user/token with invalid or incomplete data. Clearing auth state.", { userData, authToken });
      get()._clearUserAndToken();
    }
  },

  /**
   * Internal helper to clear user and token from state and localStorage.
   */
  _clearUserAndToken: () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    if (apiClient) {
      delete apiClient.defaults.headers.common['Authorization'];
    }
    set({ user: null, token: null, isAuthenticated: false, error: null, isLoading: false });
  },

  /**
   * Action to update only the user object (e.g., after a profile edit).
   */
  setUser: (userData) => {
    if (userData && typeof userData === 'object' && Object.keys(userData).length > 0) {
      localStorage.setItem('authUser', JSON.stringify(userData));
      set((state) => ({
        user: { ...(state.user || {}), ...userData },
        error: null,
      }));
    } else if (userData === null) {
      localStorage.removeItem('authUser');
      set({ user: null, error: null });
    } else {
      console.warn("setUser called with invalid or empty userData:", userData);
    }
  },

  /**
   * Action to register a new user. Expects FormData.
   */
  registerUser: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', formData);
      const { user, token } = response.data;
      get()._setUserAndToken(user, token);
      // Also fetch full profile on register to be safe
      await get().fetchUserProfile(true);
      return { success: true, user: get().user };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Action to log in a user. Handles flat API response structure.
   */
  loginUser: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, ...userData } = response.data;

      // Set initial user and token
      get()._setUserAndToken(userData, token);

      // --- THE FIX ---
      // Immediately after logging in, call fetchUserProfile to get the 
      // full, detailed user object, including all progress data.
      await get().fetchUserProfile(true); 
      // --- END FIX ---

      if (get().isAuthenticated) {
        return { success: true, user: get().user };
      } else {
        // This case should ideally not be reached if _setUserAndToken is successful
        throw new Error("Login processed but authentication failed.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed.';
      set({ isLoading: false, error: errorMsg });
      get()._clearUserAndToken(); // Clear any partial auth state on failure
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Action to log out a user.
   */
  logoutUser: () => {
    get()._clearUserAndToken();
  },

  /**
   * Action to fetch or refresh the current user's profile from the server.
   */
  fetchUserProfile: async (forceFetch = false) => {
    const currentState = get();
    // Fetch if forced, or if the user object is missing key data like progress.
    const shouldFetch = currentState.isAuthenticated && (forceFetch || !currentState.user || !currentState.user.progressBySdg);

    if (!shouldFetch) {
      return { success: true, user: currentState.user };
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/users/me');
      const apiUserData = response.data.user || response.data;

      if (apiUserData && typeof apiUserData === 'object' && Object.keys(apiUserData).length > 0) {
        get().setUser(apiUserData); // Use setUser to merge and save to localStorage
        set({ isLoading: false }); 
        return { success: true, user: get().user };
      } else {
        throw new Error("Invalid user data received from /users/me");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch user profile.';
      console.error("Fetch User Profile error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        get()._clearUserAndToken(); // If token is invalid, log the user out
      }
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },
}));

// Initialize apiClient Authorization header if a token exists when this module first loads
const initialTokenOnLoad = useAuthStore.getState().token;
if (initialTokenOnLoad && apiClient) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${initialTokenOnLoad}`;
}

export default useAuthStore;