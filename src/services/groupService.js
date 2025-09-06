import api from "@/utils/AxiosInstance";
// Group Services
export const groupService = {
  // Create a new group
  createGroup: async (groupData) => {
    try {
      const response = await api.post('/groups', groupData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all groups for the current user
  getAllGroups: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/groups?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get group by ID
  getGroupById: async (groupId) => {
    try {
      const response = await api.get(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update group information
  updateGroupInfo: async (groupId, updateData) => {
    try {
      const response = await api.put(`/groups/${groupId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add member to group
  addGroupMember: async (groupId, userEmail) => {
    try {
      const response = await api.post('/groups/add-member', {
        groupId,
        userEmail
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove member from group
  removeMemberFromGroup: async (groupId, memberId) => {
    try {
      const response = await api.delete(`/groups/${groupId}/remove-member`, {
        data: { memberId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete group
  deleteGroup: async (groupId) => {
    try {
      const response = await api.delete(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send group invite
  sendGroupInvite: async (groupId, userEmail) => {
    try {
      const response = await api.post('/groups/invite', {
        groupId,
        userEmail
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Accept or decline group invite
  handleGroupInvite: async (token, action) => {
    try {
      const response = await api.post('/groups/invite/respond', {
        token,
        action
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Leave group
  leaveGroup: async (groupId) => {
    try {
      const response = await api.post(`/groups/${groupId}/leave`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Transfer group ownership
  transferGroupOwnership: async (groupId, newOwnerId, kickSelf = false) => {
    try {
      const response = await api.post(`/groups/${groupId}/transfer-ownership`, {
        newOwnerId,
        kickSelf
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default groupService;