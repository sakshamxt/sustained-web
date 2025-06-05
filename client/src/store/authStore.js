// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '@/lib/api'; // Your configured axios instance

// Helper to get initial state from localStorage safely
const getInitialUser = () => {
  try {
    const userString = localStorage.getItem('authUser');

    if (userString === null) { // Handle null case first
      return null;
    }
    // Now userString is definitely not null, so we can safely call .trim()
    if (userString === "undefined" || userString.trim() === "") {
      localStorage.removeItem('authUser'); // Clean up specific invalid string values
      return null;
    }
    return JSON.parse(userString);
  } catch (error) { // Catches JSON.parse errors or other unexpected errors if any
    console.error("Error processing authUser from localStorage:", error);
    localStorage.removeItem('authUser'); // Clean up on any error during processing
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
    // Ensure userData is a valid object and authToken is present before setting
    if (userData && typeof userData === 'object' && Object.keys(userData).length > 0 && authToken) {
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', authToken);
      if (apiClient) { // Ensure apiClient is defined
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      }
      set({ user: userData, token: authToken, isAuthenticated: true, error: null, isLoading: false });
    } else {
      console.error("Attempted to set user/token with invalid or incomplete data. Clearing auth state.", { userData, authToken });
      // If data is invalid or token is missing, clear everything to maintain a consistent logged-out state.
      get()._clearUserAndToken(); // This will also set isLoading: false
    }
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
    // Ensure userData is a valid non-empty object or explicitly null
    if (userData && typeof userData === 'object' && Object.keys(userData).length > 0) {
      localStorage.setItem('authUser', JSON.stringify(userData));
      set((state) => ({
        user: { ...(state.user || {}), ...userData }, // Merge, ensuring state.user is not null if it exists
        error: null, // Clear previous errors on successful set
      }));
    } else if (userData === null) { // Allow explicitly setting user to null (e.g. during logout)
      localStorage.removeItem('authUser');
      set({ user: null, error: null });
    } else {
      console.warn("setUser called with invalid or empty userData:", userData);
      // Avoid storing "undefined" or empty objects that might later cause issues.
      // Depending on requirements, you might want to set an error state here or just log.
    }
  },

  // Register User Action
  registerUser: async (formData) => { // formData is expected to be FormData for file uploads
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', formData, {
        // Axios typically sets Content-Type automatically for FormData.
        // If issues, might need: headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Assuming backend returns { user: {...}, token: "..." }
      const { user, token } = response.data;
      get()._setUserAndToken(user, token); // This will also set isLoading: false
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
      console.log("[AuthStore] Login API response.data:", response.data); // Keep this log for verification

      const responseData = response.data;
      const token = responseData.token; // Extract the token

      // Create the user object from the response data, excluding the token property
      // and any other non-user-model properties if there are any.
      // This uses object destructuring to pull out 'token' and put the rest into 'userData'.
      const { token: _extractedToken, ...userData } = responseData;

      console.log("[AuthStore] Constructed from login response:", { user: userData, token });

      // Pass the constructed userData and the extracted token
      get()._setUserAndToken(userData, token);

      // Check if authentication was successful after calling _setUserAndToken
      if (get().isAuthenticated) {
        return { success: true, user: get().user }; // Return the user from the store
      } else {
        // This means _setUserAndToken determined the data was invalid and cleared auth
        return { success: false, error: "Login processed but data from server was insufficient to authenticate." };
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed.';
      console.error("[AuthStore] Login API error:", err);
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // Logout User Action
  logoutUser: () => {
    // Optional: API call to backend's /auth/logout endpoint if it exists
    // await apiClient.post('/auth/logout').catch(err => console.error("Logout API call failed:", err));
    get()._clearUserAndToken(); // Clears client-side auth state
  },

  // Fetch/Refresh User Profile
  fetchUserProfile: async (forceFetch = false) => {
    const currentState = get();
    // Determine if a fetch is necessary
    const shouldFetch = currentState.isAuthenticated &&
                        (forceFetch || !currentState.user || !currentState.user.progressBySdg /* Add other checks if needed */);

    if (!shouldFetch) {
      // Return current state if no fetch is needed and user might already be populated
      return { success: currentState.isAuthenticated && !!currentState.user, user: currentState.user, error: currentState.error };
    }

    set({ isLoading: true, error: null }); // Set loading true only if we are actually fetching
    try {
      const response = await apiClient.get('/users/me');
      // Assuming backend returns the user object directly, or nested like { user: {...} }
      const userData = response.data.user || response.data;

      if (userData && typeof userData === 'object' && Object.keys(userData).length > 0) {
        localStorage.setItem('authUser', JSON.stringify(userData));
        set({ user: userData, isLoading: false, error: null }); // Also update isAuthenticated if not already true
        return { success: true, user: userData };
      } else {
        // Handle case where API returns success but no valid user data
        throw new Error("Invalid user data received from server.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch user profile.';
      console.error("Fetch User Profile error:", err);
      // If fetching profile fails due to auth issues (401/403), log the user out.
      if (err.response?.status === 401 || err.response?.status === 403) {
        get()._clearUserAndToken(); // Token might be invalid, clear client-side auth state
      } else {
        // For other errors, just update loading and error state, don't necessarily clear user if already present
        set({ isLoading: false, error: errorMsg });
      }
      return { success: false, error: errorMsg };
    }
  },
}));

// Initialize apiClient Authorization header if a token exists when the store module is first loaded.
// This handles the case where the app is refreshed and apiClient instance is re-created.
const initialTokenOnLoad = useAuthStore.getState().token;
if (initialTokenOnLoad && apiClient) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${initialTokenOnLoad}`;
}

export default useAuthStore;