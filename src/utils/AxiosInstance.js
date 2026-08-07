import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        const newAccessToken = refreshResponse.data.accessToken;
        
        // Store new token
        localStorage.setItem('accessToken', newAccessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to sign-in
        localStorage.removeItem('accessToken');
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      }
    }

    // Extract logical error message from backend
    let logicalMessage = error.response?.data?.message || error.response?.data?.error;
    
    // Format validation errors if they exist as an array
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const details = error.response.data.errors
        .map((err) => {
          if (typeof err === "string") return err;
          return (err.field ? `${err.field}: ${err.message || err.msg}` : err.message) || "";
        })
        .filter(Boolean)
        .join(", ");
      
      if (details) {
        logicalMessage = logicalMessage ? `${logicalMessage}: ${details}` : details;
      }
    }

    if (logicalMessage) {
      error.message = logicalMessage;
    }
    
    return Promise.reject(error);
  }
);

export default api;