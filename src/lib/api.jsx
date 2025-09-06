const API_BASE_URL =
  (typeof window !== "undefined" && window.__API_BASE_URL__) ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL)) ||
  ""

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const url = `${API_BASE_URL}${path}`
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  const contentType = res.headers.get("content-type") || ""
  return contentType.includes("application/json") ? res.json() : res.text()
}

/* Friends */
export const searchUserByEmail = (email) => request(`/users/search?email=${encodeURIComponent(email)}`)
export const sendFriendRequest = (targetUserId) =>
  request(`/friends/requests`, { method: "POST", body: { targetUserId } })
export const listPendingRequests = () => request(`/friends/requests?status=pending`)
export const acceptFriendRequest = (requestId) => request(`/friends/requests/${requestId}/accept`, { method: "POST" })
export const declineFriendRequest = (requestId) => request(`/friends/requests/${requestId}/decline`, { method: "POST" })
export const listFriends = () => request(`/friends`)
export const removeFriend = (friendId) => request(`/friends/${friendId}`, { method: "DELETE" })

/* Groups */
export const createGroupApi = ({ name, members }) => request(`/groups`, { method: "POST", body: { name, members } })
export const listGroups = () => request(`/groups`)
export const getGroupById = (groupId) => request(`/groups/${groupId}`)

/* Expenses */
export const createExpenseApi = ({ groupId, title, amount, payerId, splits }) =>
  request(`/expenses`, { method: "POST", body: { groupId, title, amount, payerId, splits } })

/* Settlements */
export const createSettlementApi = ({ groupId, transactions }) =>
  request(`/settlements`, { method: "POST", body: { groupId, transactions } })

export const listSettlements = (status) =>
  request(`/settlements${status ? `?status=${encodeURIComponent(status)}` : ""}`)

export const completeSettlement = (settlementId) => request(`/settlements/${settlementId}/complete`, { method: "POST" })
export const settlementsSummary = () => request(`/settlements/summary`)
export const optimizeSettlements = ({ groupId }) =>
  request(`/settlements/optimize`, { method: "POST", body: { groupId } })
