import api from "@/utils/AxiosInstance";

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const clearToken = () => {
  localStorage.removeItem('accessToken');
};

export const getToken = () => {
  return localStorage.getItem('accessToken');
};

// User search methods
export const searchUsers = async (query, page = 1, limit = 10) => {
  const params = { query, page, limit };
  const response = await api.get('/users/search', { params });
  return response.data;
};

export const searchUserByEmail = async (email) => {
  const params = { email };
  const response = await api.get('/users/search-by-email', { params });
  return response.data;
};

export const getSuggestedUsers = async (limit = 5) => {
  const params = { limit };
  const response = await api.get('/users/suggestions', { params });
  return response.data;
};

// Friend request methods
export const sendFriendRequest = async (friendEmail) => {
  const response = await api.post('/friends/send-request', { friendEmail });
  return response.data;
};

export const getPendingFriendRequests = async () => {
  const response = await api.get('/friends/pending-requests');
  return response.data;
};

export const acceptFriendRequest = async (friendId) => {
  const response = await api.post('/friends/accept-request', { friendId });
  return response.data;
};

export const declineFriendRequest = async (friendId) => {
  const response = await api.post('/friends/decline-request', { friendId });
  return response.data;
};

// Friends methods
export const getAllFriends = async (page = 1, limit = 10) => {
  const params = { page, limit };
  const response = await api.get('/friends/get-all-friends', { params });
  return response.data;
};

export const removeFriend = async (friendId) => {
  const response = await api.post('/friends/remove-friend', { friendId });
  return response.data;
};

// Auth methods
export const getCurrentUser = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post('/refresh-token');
  return response.data;
};

// Grouped API service object (optional - for backward compatibility)
export const apiService = {
  // User search methods
  searchUsers,
  searchUserByEmail,
  getSuggestedUsers,
  
  // Friend request methods
  sendFriendRequest,
  getPendingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  
  // Friends methods
  getAllFriends,
  removeFriend,
  
  // Auth methods
  getCurrentUser,
  refreshToken,
  
  // Token methods
  setToken,
  clearToken,
  getToken
};

// Custom hook for React components
export const useApiService = () => {
  return apiService;
};

// Named exports for individual functions (recommended approach)
export default {
  // User search
  searchUsers,
  searchUserByEmail,
  getSuggestedUsers,
  
  // Friend requests
  sendFriendRequest,
  getPendingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  
  // Friends
  getAllFriends,
  removeFriend,
  
  // Auth
  getCurrentUser,
  refreshToken,
  
  // Token management
  setToken,
  clearToken,
  getToken
};