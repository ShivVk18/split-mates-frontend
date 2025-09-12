import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Receipt, DollarSign, Calendar, Users, Filter, Search, Clock, TrendingUp, AlertCircle, Loader2 } from "lucide-react"

// Import the real services
import { expenseService, expenseHelpers } from "@/services/expenseService"

export default function ExpensesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statistics, setStatistics] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Filters
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGroupId, setFilterGroupId] = useState("all")
  const [filterSplitType, setFilterSplitType] = useState("all")

  // Form data for new expense
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    groupId: "",
    paidById: "", // This should be set to current user ID
    splitType: "EQUAL",
    notes: "",
    splits: []
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  // Load expenses on component mount and when filters change
  useEffect(() => {
    loadExpenses()
    loadStatistics()
  }, [pagination.page, filterStatus, searchTerm, filterGroupId, filterSplitType])

  // Update filtered expenses when expenses change
  useEffect(() => {
    const filtered = expenseHelpers.filterExpenses(expenses, {
      search: searchTerm,
      status: filterStatus,
      groupId: filterGroupId === "all" ? "" : filterGroupId,
      splitType: filterSplitType === "all" ? "" : filterSplitType
    })
    setFilteredExpenses(filtered)
  }, [expenses, searchTerm, filterStatus, filterGroupId, filterSplitType])

  const loadExpenses = async () => {
    try {
      setLoading(true)
      setError("")
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }

      // Add filters to params
      if (filterStatus !== 'all') {
        params.isSettled = filterStatus === 'settled'
      }
      if (filterGroupId !== 'all') {
        params.groupId = filterGroupId
      }
      if (filterSplitType !== 'all') {
        params.splitType = filterSplitType
      }
      if (searchTerm) {
        params.search = searchTerm
      }

      const response = await expenseService.getAllExpenses(params)
      
      if (response.success) {
        setExpenses(response.data.expenses || [])
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: response.data.expenses?.length || 0,
          pages: 1
        })
      } else {
        setError(response.message || 'Failed to load expenses')
      }
    } catch (err) {
      setError(err.message || 'Failed to load expenses')
      console.error('Error loading expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const params = {}
      
      // Add current filters to statistics params
      if (filterStatus !== 'all') {
        params.isSettled = filterStatus === 'settled'
      }
      if (filterGroupId !== 'all') {
        params.groupId = filterGroupId
      }

      const response = await expenseService.getExpenseStatistics(params)
      if (response.success) {
        setStatistics(response.data)
      }
    } catch (err) {
      console.error('Failed to load statistics:', err)
    }
  }

  const handleCreateExpense = async () => {
    try {
      setFormLoading(true)
      setFormError("")

      // Validate form data
      const validation = expenseHelpers.validateExpenseData(formData)
      if (!validation.isValid) {
        setFormError(Object.values(validation.errors)[0])
        return
      }

      // Prepare expense data
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        // Add default splits if not provided (for equal split)
        splits: formData.splits.length > 0 ? formData.splits : [
          { userId: formData.paidById, amount: parseFloat(formData.amount) }
        ]
      }

      const response = await expenseService.createExpense(expenseData)
      
      if (response.success) {
        setIsCreateDialogOpen(false)
        resetForm()
        loadExpenses()
        loadStatistics()
      } else {
        setFormError(response.message || 'Failed to create expense')
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create expense')
      console.error('Error creating expense:', err)
    } finally {
      setFormLoading(false)
    }
  }

  const handleMarkAsSettled = async (expenseId) => {
    try {
      const response = await expenseService.markExpenseAsSettled(expenseId)
      if (response.success) {
        loadExpenses()
        loadStatistics()
      } else {
        setError(response.message || 'Failed to settle expense')
      }
    } catch (err) {
      setError(err.message || 'Failed to settle expense')
      console.error('Error settling expense:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      groupId: "",
      paidById: "", // This should be set to current user ID
      splitType: "EQUAL",
      notes: "",
      splits: []
    })
    setFormError("")
  }

  const getCategoryColor = (splitType) => {
    const colorMap = {
      'EQUAL': 'emerald',
      'PERCENTAGE': 'blue',
      'EXACT': 'purple',
      'SHARES': 'orange'
    }
    return colorMap[splitType] || 'slate'
  }

  const getStatusBadgeVariant = (isSettled) => {
    return isSettled ? 'default' : 'secondary'
  }

  // Calculate statistics from current data
  const currentStats = {
    totalExpenses: statistics?.totalAmount || 0,
    pendingExpenses: expenses.filter(e => !e.isSettled).length,
    settledExpenses: expenses.filter(e => e.isSettled).length
  }

  if (loading && expenses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-slate-600">Loading expenses...</p>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent">
              Expenses
            </h1>
            <p className="text-slate-600 text-lg mt-2">Track and manage all your shared expenses</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl px-6 py-2.5 rounded-2xl font-medium transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-slate-800">Add New Expense</DialogTitle>
                <DialogDescription className="text-slate-600">Create a new expense to split with your group.</DialogDescription>
              </DialogHeader>
              {formError && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  {formError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="expenseTitle" className="text-slate-700 font-medium">Expense Description</Label>
                  <Input 
                    id="expenseTitle" 
                    placeholder="What did you spend on?" 
                    className="mt-1 rounded-xl border-slate-200"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount" className="text-slate-700 font-medium">Amount</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      className="mt-1 rounded-xl border-slate-200"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="group" className="text-slate-700 font-medium">Group (Optional)</Label>
                    <Select value={formData.groupId} onValueChange={(value) => setFormData(prev => ({ ...prev, groupId: value }))}>
                      <SelectTrigger className="mt-1 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Personal">Personal Expense</SelectItem>
                        {/* These should be loaded dynamically from your groups API */}
                        <SelectItem value="weekend-trip">Weekend Trip</SelectItem>
                        <SelectItem value="roommates">Roommates</SelectItem>
                        <SelectItem value="office-lunch">Office Lunch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="splitType" className="text-slate-700 font-medium">Split Type</Label>
                  <Select value={formData.splitType} onValueChange={(value) => setFormData(prev => ({ ...prev, splitType: value }))}>
                    <SelectTrigger className="mt-1 rounded-xl border-slate-200">
                      <SelectValue placeholder="How to split?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EQUAL">Split Equally</SelectItem>
                      <SelectItem value="PERCENTAGE">By Percentage</SelectItem>
                      <SelectItem value="EXACT">Exact Amounts</SelectItem>
                      <SelectItem value="SHARES">By Shares</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description" className="text-slate-700 font-medium">Notes (Optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Add any notes..." 
                    className="mt-1 rounded-xl border-slate-200"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-xl"
                    onClick={handleCreateExpense}
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Add Expense'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-4 text-red-600 bg-red-50 border border-red-200 rounded-2xl"
          >
            <AlertCircle className="h-5 w-5" />
            {error}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError("")}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              Dismiss
            </Button>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <Badge variant="outline" className="text-xs border-blue-200 text-blue-600 bg-blue-50">
                  Total
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                <p className="text-3xl font-bold text-blue-600">
                  {expenseHelpers.formatExpenseAmount(currentStats.totalExpenses)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <Badge variant="outline" className="text-xs border-orange-200 text-orange-600 bg-orange-50">
                  Pending
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Pending Expenses</p>
                <p className="text-3xl font-bold text-orange-600">{currentStats.pendingExpenses}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-600 bg-emerald-50">
                  Settled
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Settled Expenses</p>
                <p className="text-3xl font-bold text-emerald-600">{currentStats.settledExpenses}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search expenses, groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-3 bg-slate-100/80 border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white/80 transition-all duration-200"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-100/80 border-0 rounded-2xl focus:ring-2 focus:ring-blue-600/20">
                    <Filter className="h-4 w-4 mr-2 text-slate-500" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    <SelectItem value="all">All Expenses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="settled">Settled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSplitType} onValueChange={setFilterSplitType}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-100/80 border-0 rounded-2xl focus:ring-2 focus:ring-blue-600/20">
                    <SelectValue placeholder="Split Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="EQUAL">Equal Split</SelectItem>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="EXACT">Exact Amount</SelectItem>
                    <SelectItem value="SHARES">Shares</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expenses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
              <p className="mt-2 text-slate-600">Loading expenses...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
              <CardContent className="p-12 text-center">
                <Receipt className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No expenses found</h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || filterStatus !== 'all' || filterSplitType !== 'all'
                    ? "No expenses match your current filters." 
                    : "Start by creating your first expense."}
                </p>
                {(!searchTerm && filterStatus === 'all' && filterSplitType === 'all') && (
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Expense
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r from-${getCategoryColor(expense.splitType)}-100 to-${getCategoryColor(expense.splitType)}-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <Receipt className={`h-6 w-6 text-${getCategoryColor(expense.splitType)}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">{expense.description}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            {expense.group && (
                              <p className="text-sm text-slate-600 font-medium">{expense.group.name}</p>
                            )}
                            <Badge variant="outline" className="text-xs border-slate-200 text-slate-600 bg-slate-50">
                              {expenseHelpers.getSplitTypeText(expense.splitType)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Users className="h-3 w-3" />
                              {expense.splits?.length || 0} people
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          {expenseHelpers.formatExpenseAmount(expense.amount, expense.currency)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={getStatusBadgeVariant(expense.isSettled)}
                            className={expense.isSettled 
                              ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-0" 
                              : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {expenseHelpers.getExpenseStatusText(expense)}
                          </Badge>
                          <span className="text-sm text-slate-600">
                            {new Date(expense.date || expense.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                          Paid by <span className="font-medium text-slate-900">{expense.paidBy?.name || 'Unknown'}</span>
                          {expense.notes && (
                            <span className="ml-2 text-xs text-slate-500">• {expense.notes}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!expense.isSettled && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl font-medium"
                              onClick={() => handleMarkAsSettled(expense.id)}
                            >
                              Mark as Settled
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-medium"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-4"
          >
            <Button
              variant="outline"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="rounded-xl"
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <Button
              variant="outline"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
              disabled={pagination.page === pagination.pages}
              className="rounded-xl"
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}