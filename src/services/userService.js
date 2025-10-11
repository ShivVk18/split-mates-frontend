import api from "@/utils/AxiosInstance"

export const userService = {
  searchByEmail: async (email) => {
    const { data } = await api.get(`/users/search-by-email?email=${encodeURIComponent(email)}`)
    return data
  },
  searchUsers: async (query, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      query,
      page: String(page),
      limit: String(limit),
    })
    const { data } = await api.get(`/users/search?${params.toString()}`)
    return data
  },
  getSuggestedUsers: async (limit = 6) => {
    const { data } = await api.get(`/users/suggestions?limit=${limit}`)
    return data
  },
}
