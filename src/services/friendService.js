import api from "@/utils/AxiosInstance"

export const friendService = {
  sendFriendRequest: async (friendEmail) => {
    const { data } = await api.post("/friends/send-request", { friendEmail })
    return data
  },
  getPendingFriendRequests: async () => {
    const { data } = await api.get("/friends/pending-requests")
    return data
  },
  acceptFriendRequest: async (friendId) => {
    const { data } = await api.post("/friends/accept-request", { friendId })
    return data
  },
  declineFriendRequest: async (friendId) => {
    const { data } = await api.post("/friends/decline-request", { friendId })
    return data
  },
  getAllFriends: async ({ page = 1, limit = 10 } = {}) => {
    const { data } = await api.get(`/friends/get-all-friends?page=${page}&limit=${limit}`)
    return data
  },
  removeFriend: async (friendId) => {
    const { data } = await api.post("/friends/remove-friend", { friendId })
    return data
  },
}
