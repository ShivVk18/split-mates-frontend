

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Check, X, Mail, Search, Users, Loader2, AlertCircle, UserMinus, RefreshCw } from "lucide-react"

// Import individual API functions
import {
  searchUsers,
  getSuggestedUsers,
  sendFriendRequest,
  getPendingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  removeFriend
} from '../services/apiService'

// Custom hook for debounced value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Custom hook for throttled function
const useThrottle = (callback, delay) => {
  const [isThrottled, setIsThrottled] = useState(false)

  const throttledCallback = useCallback((...args) => {
    if (!isThrottled) {
      callback(...args)
      setIsThrottled(true)
      setTimeout(() => setIsThrottled(false), delay)
    }
  }, [callback, delay, isThrottled])

  return throttledCallback
}

// Custom hook for friends management
const useFriends = () => {
  const [state, setState] = useState({
    friends: [],
    friendRequests: [],
    suggestedUsers: [],
    searchResults: [],
    loading: {
      initialLoad: true,
      search: false,
      sendRequest: false,
      acceptRequest: {},
      declineRequest: {},
      removeFriend: {},
      suggestions: false
    },
    error: '',
    success: ''
  });

  // Helper to update loading state
  const setLoading = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      loading: typeof updates === 'function' ? updates(prev.loading) : { ...prev.loading, ...updates }
    }));
  }, []);

  // Helper to set error/success messages
  const setMessage = useCallback((type, message) => {
    setState(prev => ({ ...prev, [type]: message }));
    
    if (message) {
      setTimeout(() => {
        setState(prev => ({ ...prev, [type]: '' }));
      }, 5000);
    }
  }, []);

  // Load all friends
  const loadFriends = useCallback(async () => {
    try {
      const response = await getAllFriends();
      setState(prev => ({ 
        ...prev, 
        friends: response.data?.friends || [] 
      }));
    } catch (error) {
      console.error('Failed to load friends:', error);
      if (error.response?.status !== 401) {
        setMessage('error', 'Failed to load friends: ' + (error.response?.data?.message || error.message));
      }
    }
  }, [setMessage]);

  // Load friend requests
  const loadFriendRequests = useCallback(async () => {
    try {
      const response = await getPendingFriendRequests();
      setState(prev => ({ 
        ...prev, 
        friendRequests: response.data?.requests || [] 
      }));
    } catch (error) {
      console.error('Failed to load friend requests:', error);
      if (error.response?.status !== 401) {
        setMessage('error', 'Failed to load friend requests: ' + (error.response?.data?.message || error.message));
      }
    }
  }, [setMessage]);

  // Load suggested users
  const loadSuggestedUsers = useCallback(async () => {
    setLoading({ suggestions: true });
    try {
      const response = await getSuggestedUsers(5);
      setState(prev => ({ 
        ...prev, 
        suggestedUsers: response.data?.users || [] 
      }));
    } catch (error) {
      console.error('Failed to load suggestions:', error);
      // Don't show error for suggestions as it's not critical
    } finally {
      setLoading({ suggestions: false });
    }
  }, [setLoading]);

  // Search users function
  const handleSearchUsers = useCallback(async (query) => {
    if (query.length < 2) {
      setState(prev => ({ ...prev, searchResults: [] }));
      return;
    }

    setLoading({ search: true });
    setMessage('error', '');
    
    try {
      const response = await searchUsers(query);
      setState(prev => ({ 
        ...prev, 
        searchResults: response.data?.users || [] 
      }));
    } catch (error) {
      console.error('Search error:', error);
      if (error.response?.status !== 401) {
        setMessage('error', 'Failed to search users: ' + (error.response?.data?.message || error.message));
      }
      setState(prev => ({ ...prev, searchResults: [] }));
    } finally {
      setLoading({ search: false });
    }
  }, [setLoading, setMessage]);

  // Send friend request
  const handleSendFriendRequest = useCallback(async (email) => {
    setLoading({ sendRequest: true });
    setMessage('error', '');
    setMessage('success', '');

    try {
      await sendFriendRequest(email);
      setMessage('success', 'Friend request sent successfully!');
      
      // Update search results and suggested users
      setState(prev => ({
        ...prev,
        searchResults: prev.searchResults.map(user => 
          user.email === email 
            ? { ...user, relationStatus: 'request_sent' }
            : user
        ),
        suggestedUsers: prev.suggestedUsers.map(user =>
          user.email === email
            ? { ...user, relationStatus: 'request_sent' }
            : user
        )
      }));
      
      return true;
    } catch (error) {
      console.error('Send request error:', error);
      if (error.response?.status !== 401) {
        setMessage('error', 'Failed to send friend request: ' + (error.response?.data?.message || error.message));
      }
      return false;
    } finally {
      setLoading({ sendRequest: false });
    }
  }, [setLoading, setMessage]);

  // Accept friend request
  const handleAcceptFriendRequest = useCallback(async (request) => {
    setLoading(prev => ({ 
      acceptRequest: { ...prev.acceptRequest, [request.id]: true }
    }));
    setMessage('error', '');
    setMessage('success', '');

    try {
      await acceptFriendRequest(request.user.id);
      setMessage('success', `Friend request from ${request.user.name} accepted!`);
      
      // Move from requests to friends
      const newFriend = {
        id: request.user.id,
        name: request.user.name,
        email: request.user.email,
        avatar: request.user.avatar,
        isOnline: request.user.isOnline
      };
      
      setState(prev => ({
        ...prev,
        friends: [...prev.friends, newFriend],
        friendRequests: prev.friendRequests.filter(req => req.id !== request.id)
      }));
      
      return true;
    } catch (error) {
      console.error('Accept request error:', error);
      if (error.response?.status !== 401) {
        setMessage('error', 'Failed to accept friend request: ' + (error.response?.data?.message || error.message));
      }
      return false;
    } finally {
      setLoading(prev => ({ 
        acceptRequest: { ...prev.acceptRequest, [request.id]: false }
      }));
    }
  }, [setLoading, setMessage]);

  // Decline friend request
  const handleDeclineFriendRequest = useCallback(async (request) => {
    setLoading(prev => ({ 
      declineRequest: { ...prev.declineRequest, [request.id]: true }
    }));
    setMessage('error', '');
    setMessage('success', '');

    try {
      await declineFriendRequest(request.user.id);
      setMessage('success', 'Friend request declined');
      setState(prev => ({
        ...prev,
        friendRequests: prev.friendRequests.filter(req => req.id !== request.id)
      }));
      return true;
    } catch (error) {
      console.error('Decline request error:', error);
      if (error.response?.status !== 401) {
        setMessage('error', 'Failed to decline friend request: ' + (error.response?.data?.message || error.message));
      }
      return false;
    } finally {
      setLoading(prev => ({ 
        declineRequest: { ...prev.declineRequest, [request.id]: false }
      }));
    }
  }, [setLoading, setMessage]);

  // Remove friend
  const handleRemoveFriend = useCallback(async (friendId, friendName) => {
    if (!confirm(`Are you sure you want to remove ${friendName} from your friends?`)) {
      return false;
    }

    setLoading(prev => ({ 
      removeFriend: { ...prev.removeFriend, [friendId]: true }
    }));
    setMessage('error', '');
    setMessage('success', '');

    try {
      await removeFriend(friendId);
      setMessage('success', `${friendName} removed from friends`);
      setState(prev => ({
        ...prev,
        friends: prev.friends.filter(friend => friend.id !== friendId)
      }));
      return true;
    } catch (error) {
      console.error('Remove friend error:', error);
      if (error.response?.status !== 401) {
        setMessage('error', 'Failed to remove friend: ' + (error.response?.data?.message || error.message));
      }
      return false;
    } finally {
      setLoading(prev => ({ 
        removeFriend: { ...prev.removeFriend, [friendId]: false }
      }));
    }
  }, [setLoading, setMessage]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading({ initialLoad: true });
      setMessage('error', '');
      
      try {
        await Promise.allSettled([
          loadFriends(),
          loadFriendRequests()
        ]);
        
        // Load suggested users in background
        loadSuggestedUsers();
        
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading({ initialLoad: false });
      }
    };

    initializeData();
  }, [loadFriends, loadFriendRequests, loadSuggestedUsers, setLoading, setMessage]);

  return {
    // State
    friends: state.friends,
    friendRequests: state.friendRequests,
    suggestedUsers: state.suggestedUsers,
    searchResults: state.searchResults,
    loading: state.loading,
    error: state.error,
    success: state.success,
    
    // Actions
    searchUsers: handleSearchUsers,
    sendFriendRequest: handleSendFriendRequest,
    acceptFriendRequest: handleAcceptFriendRequest,
    declineFriendRequest: handleDeclineFriendRequest,
    removeFriend: handleRemoveFriend,
    loadSuggestedUsers,
    
    // Helpers
    clearMessages: () => {
      setMessage('error', '');
      setMessage('success', '');
    }
  };
};

export default function FriendsPage() {
  const {
    friends,
    friendRequests,
    suggestedUsers,
    searchResults,
    loading,
    error,
    success,
    searchUsers: handleSearchUsers,
    sendFriendRequest: handleSendFriendRequest,
    acceptFriendRequest: handleAcceptFriendRequest,
    declineFriendRequest: handleDeclineFriendRequest,
    removeFriend: handleRemoveFriend,
    loadSuggestedUsers
  } = useFriends();

  const [searchTerm, setSearchTerm] = useState("")
  const [friendSearchTerm, setFriendSearchTerm] = useState("")
  const [newFriendEmail, setNewFriendEmail] = useState("")

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Throttled search function
  const throttledSearch = useThrottle(handleSearchUsers, 500)

  // Effect for debounced search
  useEffect(() => {
    throttledSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, throttledSearch])

  const onSendFriendRequest = async (email) => {
    const success = await handleSendFriendRequest(email)
    if (success) {
      setNewFriendEmail("")
    }
  }

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(friendSearchTerm.toLowerCase()) ||
      friend.email.toLowerCase().includes(friendSearchTerm.toLowerCase())
  )

  const getActionButton = (user) => {
    switch (user.relationStatus) {
      case 'friends':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            Friends
          </Badge>
        )
      case 'request_sent':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Request Sent
          </Badge>
        )
      case 'request_received':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Request Received
          </Badge>
        )
      default:
        return (
          <Button
            size="sm"
            onClick={() => onSendFriendRequest(user.email)}
            disabled={loading.sendRequest}
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          >
            {loading.sendRequest ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-1" />
                Add Friend
              </>
            )}
          </Button>
        )
    }
  }

  if (loading.initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading your friends...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="max-w-6xl mx-auto space-y-8 relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent">
            Friends & Connections
          </h1>
          <p className="text-slate-600 text-lg">Manage your friends and connect with new people</p>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggested Users Section */}
        {suggestedUsers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Users className="h-5 w-5 text-purple-600" />
                  Suggested Friends
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={loadSuggestedUsers}
                    disabled={loading.suggestions}
                    className="ml-auto"
                  >
                    {loading.suggestions ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
                <CardDescription className="text-slate-600">
                  People you might know
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {suggestedUsers.map((user) => (
                    <div key={user.id} className="flex-shrink-0 w-64">
                      <Card className="bg-white/80 border-slate-200/60">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate">{user.name}</p>
                              <p className="text-sm text-slate-600 truncate">{user.email}</p>
                            </div>
                          </div>
                          {getActionButton(user)}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search Users Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Search className="h-5 w-5 text-blue-600" />
                Find Friends
              </CardTitle>
              <CardDescription className="text-slate-600">
                Search for users by name, username, or email (minimum 2 characters)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-slate-100/80 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white/80"
                />
                {loading.search && (
                  <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 animate-spin" />
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <h4 className="text-sm font-medium text-slate-600">Search Results ({searchResults.length})</h4>
                  {searchResults.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-slate-200/60 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-600">{user.email}</p>
                          {user.userName && (
                            <p className="text-xs text-slate-500">@{user.userName}</p>
                          )}
                        </div>
                      </div>
                      {getActionButton(user)}
                    </motion.div>
                  ))}
                </div>
              )}

              {searchTerm.length >= 2 && !loading.search && searchResults.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No users found matching "{searchTerm}"</p>
                </div>
              )}

              {searchTerm.length > 0 && searchTerm.length < 2 && (
                <div className="text-center py-4 text-slate-500">
                  <p className="text-sm">Enter at least 2 characters to search</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Friend by Email */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <UserPlus className="h-5 w-5 text-blue-600" />
                Add Friend by Email
              </CardTitle>
              <CardDescription className="text-slate-600">
                Send a friend request directly to an email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter email address..."
                  type="email"
                  value={newFriendEmail}
                  onChange={(e) => setNewFriendEmail(e.target.value)}
                  className="flex-1 bg-slate-100/80 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white/80"
                />
                <Button
                  onClick={() => onSendFriendRequest(newFriendEmail)}
                  disabled={!newFriendEmail || loading.sendRequest}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl rounded-2xl font-medium"
                >
                  {loading.sendRequest ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Send Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Friends Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Tabs defaultValue="friends" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-1">
              <TabsTrigger 
                value="friends" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200"
              >
                My Friends ({friends.length})
              </TabsTrigger>
              <TabsTrigger 
                value="requests" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200"
              >
                Requests ({friendRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends" className="space-y-6">
              {/* Friends Search */}
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search your friends..."
                      value={friendSearchTerm}
                      onChange={(e) => setFriendSearchTerm(e.target.value)}
                      className="pl-11 pr-4 py-3 bg-slate-100/80 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white/80"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Friends List */}
              <div className="grid gap-4">
                <AnimatePresence>
                  {filteredFriends.map((friend, index) => (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-700 text-white font-semibold">
                                  {friend.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-slate-900 text-lg">{friend.name}</h3>
                                <p className="text-slate-600">{friend.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={friend.isOnline ? "default" : "secondary"}
                                className={friend.isOnline 
                                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-0" 
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                                }
                              >
                                {friend.isOnline ? "Online" : "Offline"}
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveFriend(friend.id, friend.name)}
                                disabled={loading.removeFriend[friend.id]}
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl font-medium"
                              >
                                {loading.removeFriend[friend.id] ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <UserMinus className="h-4 w-4 mr-1" />
                                )}
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredFriends.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      {friendSearchTerm ? "No friends found" : "No friends yet"}
                    </h3>
                    <p>
                      {friendSearchTerm 
                        ? `No friends match "${friendSearchTerm}"`
                        : "Start by searching for people and sending friend requests!"
                      }
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <div className="grid gap-4">
                <AnimatePresence>
                  {friendRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                <AvatarImage src={request.user?.avatar || "/placeholder.svg"} alt={request.user?.name} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold">
                                  {request.user?.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-slate-900 text-lg">{request.user?.name}</h3>
                                <p className="text-slate-600">{request.user?.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleAcceptFriendRequest(request)}
                                disabled={loading.acceptRequest[request.id]}
                                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl rounded-xl font-medium"
                              >
                                {loading.acceptRequest[request.id] ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4 mr-1" />
                                )}
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeclineFriendRequest(request)}
                                disabled={loading.declineRequest[request.id]}
                                className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300 rounded-xl font-medium"
                              >
                                {loading.declineRequest[request.id] ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4 mr-1" />
                                )}
                                Decline
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {friendRequests.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                    <p>Friend requests will appear here when someone wants to connect with you.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
                