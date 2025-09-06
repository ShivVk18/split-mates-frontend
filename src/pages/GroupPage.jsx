import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Plus, Settings, DollarSign, Calendar, UserPlus, Loader2, AlertCircle } from "lucide-react"
import { groupService } from "../services/groupService"

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "INR", label: "INR (₹)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" }
]

const CATEGORY_OPTIONS = [
  { value: "GENERAL", label: "General" },
  { value: "TRAVEL", label: "Travel" },
  { value: "FOOD", label: "Food & Dining" },
  { value: "UTILITIES", label: "Utilities" },
  { value: "ENTERTAINMENT", label: "Entertainment" },
  { value: "SHOPPING", label: "Shopping" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "OTHER", label: "Other" }
]

export default function GroupsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)
  
  // Form state
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    description: "",
    category: "GENERAL",
    currency: "USD"
  })

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await groupService.getAllGroups()
      setGroups(response.data?.groups || [])
    } catch (err) {
      setError(err.message || "Failed to fetch groups")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async () => {
    if (!newGroupData.name.trim()) {
      setError("Group name is required")
      return
    }

    try {
      setCreating(true)
      setError(null)
      await groupService.createGroup(newGroupData)
      
      // Reset form
      setNewGroupData({
        name: "",
        description: "",
        category: "GENERAL",
        currency: "USD"
      })
      
      setIsCreateDialogOpen(false)
      
      // Refresh groups list
      await fetchGroups()
    } catch (err) {
      setError(err.message || "Failed to create group")
    } finally {
      setCreating(false)
    }
  }

  const handleInputChange = (field, value) => {
    setNewGroupData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      CAD: "$",
      AUD: "$"
    }
    return symbols[currency] || "$"
  }

  const getColorByIndex = (index) => {
    const colors = ["blue", "emerald", "purple", "orange", "pink", "indigo", "teal", "rose"]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Loading groups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="max-w-6xl mx-auto space-y-8 relative">
        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent">
              Groups
            </h1>
            <p className="text-slate-600 text-lg mt-2">Manage your expense groups and collaborations</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl px-6 py-2.5 rounded-2xl font-medium transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-slate-800">Create New Group</DialogTitle>
                <DialogDescription className="text-slate-600">Create a new group to start sharing expenses with friends.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="groupName" className="text-slate-700 font-medium">Group Name *</Label>
                  <Input
                    id="groupName"
                    placeholder="Enter group name..."
                    value={newGroupData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="groupDescription" className="text-slate-700 font-medium">Description</Label>
                  <Textarea
                    id="groupDescription"
                    placeholder="What's this group for?"
                    value={newGroupData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1 rounded-xl border-slate-200"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Category</Label>
                    <Select value={newGroupData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="mt-1 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Currency</Label>
                    <Select value={newGroupData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger className="mt-1 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCY_OPTIONS.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-xl"
                    onClick={handleCreateGroup}
                    disabled={creating}
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Group"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Groups Grid */}
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, index) => {
              const color = getColorByIndex(index)
              const currencySymbol = getCurrencySymbol(group.currency)
              
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 cursor-pointer group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                            <AvatarFallback className={`bg-gradient-to-r from-${color}-600 to-${color}-700 text-white font-semibold`}>
                              {getInitials(group.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg text-slate-900">{group.name}</CardTitle>
                            <CardDescription className="text-sm text-slate-600">
                              {group.description || `${group.category.toLowerCase().replace('_', ' ')} expenses`}
                            </CardDescription>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Members */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600 font-medium">{group.totalMembers} members</span>
                        </div>
                        <div className="flex -space-x-2">
                          {Array.from({ length: Math.min(group.totalMembers, 3) }).map((_, i) => (
                            <Avatar key={i} className="h-6 w-6 border-2 border-white shadow-sm">
                              <AvatarFallback className={`text-xs bg-gradient-to-r from-${color}-600 to-${color}-700 text-white`}>
                                U{i + 1}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {group.totalMembers > 3 && (
                            <div className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center shadow-sm">
                              <span className="text-xs text-slate-600 font-medium">+{group.totalMembers - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`text-center p-3 bg-gradient-to-r from-${color}-50/80 to-${color}-100/80 rounded-xl border border-${color}-200/30`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <DollarSign className={`h-4 w-4 text-${color}-600`} />
                            <span className={`text-xs text-${color}-600 font-medium`}>Currency</span>
                          </div>
                          <p className={`text-lg font-bold text-${color}-700`}>{currencySymbol} {group.currency}</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-r from-slate-50/80 to-slate-100/80 rounded-xl border border-slate-200/30">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Calendar className="h-4 w-4 text-slate-600" />
                            <span className="text-xs text-slate-600 font-medium">Created</span>
                          </div>
                          <p className="text-sm font-bold text-slate-700">
                            {new Date(group.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-medium"
                          onClick={() => window.location.href = `/groups/${group.id}`}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className={`bg-gradient-to-r from-${color}-600 to-${color}-700 hover:from-${color}-700 hover:to-${color}-800 rounded-xl font-medium`}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Invite
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg max-w-md mx-auto">
              <CardContent className="p-8">
                <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Groups Yet</h3>
                <p className="text-slate-600 mb-6">Create your first group to start sharing expenses with friends.</p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-xl font-medium"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Group
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}