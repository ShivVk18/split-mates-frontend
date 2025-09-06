import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpRight, ArrowDownLeft, DollarSign, CheckCircle, Clock, Plus, AlertCircle, Loader2, Users } from "lucide-react"
import { settlementService, settlementHelpers } from "../services/settlementService"

export default function SettlementsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  // Data states
  const [balanceSummary, setBalanceSummary] = useState(null)
  const [pendingSettlements, setPendingSettlements] = useState([])
  const [completedSettlements, setCompletedSettlements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Pagination states
  const [pendingPagination, setPendingPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [completedPagination, setCompletedPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  // Form states
  const [formData, setFormData] = useState({
    paidToId: "",
    groupId: "",
    amount: "",
    note: "",
    method: "CASH"
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  // Available users/groups for form (would come from API in real app)
  const [availableUsers, setAvailableUsers] = useState([])
  const [availableGroups, setAvailableGroups] = useState([])

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError("")
      
      await Promise.all([
        loadBalanceSummary(),
        loadPendingSettlements(),
        loadCompletedSettlements()
      ])
    } catch (err) {
      setError(err.message || 'Failed to load settlements data')
    } finally {
      setLoading(false)
    }
  }

  const loadBalanceSummary = async () => {
    try {
      const response = await settlementService.getBalanceSummary()
      if (response.success) {
        setBalanceSummary(response.data)
      }
    } catch (err) {
      console.error('Failed to load balance summary:', err)
    }
  }

  const loadPendingSettlements = async (page = 1) => {
    try {
      const response = await settlementService.getPendingSettlements({ page, limit: 10 })
      if (response.success) {
        setPendingSettlements(response.data.settlements)
        setPendingPagination({
          page: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.totalItems
        })
      }
    } catch (err) {
      console.error('Failed to load pending settlements:', err)
    }
  }

  const loadCompletedSettlements = async (page = 1) => {
    try {
      const response = await settlementService.getSettlementHistory({ 
        page, 
        limit: 10,
        status: 'COMPLETED'
      })
      if (response.success) {
        setCompletedSettlements(response.data.settlements)
        setCompletedPagination({
          page: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.totalItems
        })
      }
    } catch (err) {
      console.error('Failed to load completed settlements:', err)
    }
  }

  const handleCreateSettlement = async () => {
    try {
      setFormLoading(true)
      setFormError("")

      // Validate form data
      const validation = settlementHelpers.validateSettlementData(formData)
      if (!validation.isValid) {
        setFormError(Object.values(validation.errors)[0])
        return
      }

      const response = await settlementService.createSettlement({
        ...formData,
        amount: parseFloat(formData.amount)
      })
      
      if (response.success) {
        setIsCreateDialogOpen(false)
        resetForm()
        // Reload data
        await Promise.all([
          loadBalanceSummary(),
          loadPendingSettlements(),
          loadCompletedSettlements()
        ])
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create settlement')
    } finally {
      setFormLoading(false)
    }
  }

  const handleMarkComplete = async (settlementId) => {
    try {
      const response = await settlementService.markSettlementComplete(settlementId)
      if (response.success) {
        // Reload data
        await Promise.all([
          loadBalanceSummary(),
          loadPendingSettlements(),
          loadCompletedSettlements()
        ])
      }
    } catch (err) {
      setError(err.message || 'Failed to complete settlement')
    }
  }

  const resetForm = () => {
    setFormData({
      paidToId: "",
      groupId: "",
      amount: "",
      note: "",
      method: "CASH"
    })
    setFormError("")
  }

  const getCurrentUserId = () => {
    // In a real app, this would come from auth context
    return "current-user-id"
  }

  if (loading && !balanceSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-slate-600">Loading settlements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Settlements
            </h1>
            <p className="text-gray-600 text-lg mt-2">Manage payments and settle balances</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Plus className="h-4 w-4 mr-2" />
                Create Settlement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Settlement</DialogTitle>
                <DialogDescription>Record a payment to settle balances with friends.</DialogDescription>
              </DialogHeader>
              {formError && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  {formError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="person">Settle with</Label>
                  <Select value={formData.paidToId} onValueChange={(value) => setFormData(prev => ({...prev, paidToId: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="group">Group (Optional)</Label>
                  <Select value={formData.groupId} onValueChange={(value) => setFormData(prev => ({...prev, groupId: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Personal Settlement</SelectItem>
                      {availableGroups.map(group => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({...prev, amount: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="method">Payment Method</Label>
                  <Select value={formData.method} onValueChange={(value) => setFormData(prev => ({...prev, method: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="How did you pay?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="VENMO">Venmo</SelectItem>
                      <SelectItem value="PAYPAL">PayPal</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea 
                    id="note" 
                    placeholder="Add a note about this payment..." 
                    value={formData.note}
                    onChange={(e) => setFormData(prev => ({...prev, note: e.target.value}))}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700"
                    onClick={handleCreateSettlement}
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Record Payment'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
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
          </motion.div>
        )}

        {/* Balance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">You are owed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {settlementHelpers.formatCurrency(balanceSummary?.totalOwed || 0)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                  <ArrowDownLeft className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">You owe</p>
                  <p className="text-2xl font-bold text-red-600">
                    {settlementHelpers.formatCurrency(balanceSummary?.totalOwing || 0)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-xl">
                  <ArrowUpRight className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Net Balance</p>
                  <p className={`text-2xl font-bold ${(balanceSummary?.netBalance || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {settlementHelpers.formatCurrency(Math.abs(balanceSummary?.netBalance || 0))}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${(balanceSummary?.netBalance || 0) >= 0 ? "bg-gradient-to-r from-green-100 to-green-200" : "bg-gradient-to-r from-red-100 to-red-200"}`}
                >
                  <DollarSign className={`h-6 w-6 ${(balanceSummary?.netBalance || 0) >= 0 ? "text-green-600" : "text-red-600"}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Balances Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-blue-700">Current Balances</CardTitle>
              <CardDescription>Outstanding balances with your friends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {balanceSummary?.relationships && balanceSummary.relationships.length > 0 ? (
                  balanceSummary.relationships.map((relationship, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={relationship.user?.avatar} alt={relationship.user?.name} />
                          <AvatarFallback>
                            {relationship.user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{relationship.user?.name}</p>
                          <p className="text-sm text-gray-600">
                            {relationship.balance > 0 ? "Owes you" : "You owe"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${relationship.balance > 0 ? "text-green-600" : "text-red-600"}`}>
                          {settlementHelpers.formatCurrency(Math.abs(relationship.balance))}
                        </p>
                        <Button size="sm" variant="outline">
                          Settle
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No outstanding balances</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settlements History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Pending ({pendingSettlements.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Completed ({completedSettlements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                  <p className="mt-2 text-slate-600">Loading pending settlements...</p>
                </div>
              ) : pendingSettlements.length === 0 ? (
                <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
                  <CardContent className="p-12 text-center">
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No pending settlements</h3>
                    <p className="text-gray-500 mb-6">All your settlements are up to date!</p>
                  </CardContent>
                </Card>
              ) : (
                pendingSettlements.map((settlement, index) => (
                  <motion.div
                    key={settlement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
                              <Clock className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {settlementHelpers.formatSettlementDirection(settlement, getCurrentUserId())}
                              </h3>
                              <div className="text-sm text-gray-600">
                                {settlement.group?.name && `${settlement.group.name} • `}
                                {new Date(settlement.createdAt).toLocaleDateString()}
                                {settlement.description && ` • ${settlement.description}`}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                via {settlementHelpers.getPaymentMethodText(settlement.method)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              {settlementHelpers.formatCurrency(settlement.amount)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">
                                {settlementHelpers.getSettlementStatusInfo(settlement.status).text}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleMarkComplete(settlement.id)}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                Complete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                  <p className="mt-2 text-slate-600">Loading completed settlements...</p>
                </div>
              ) : completedSettlements.length === 0 ? (
                <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No completed settlements</h3>
                    <p className="text-gray-500">Your completed settlements will appear here.</p>
                  </CardContent>
                </Card>
              ) : (
                completedSettlements.map((settlement, index) => (
                  <motion.div
                    key={settlement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {settlementHelpers.formatSettlementDirection(settlement, getCurrentUserId())}
                              </h3>
                              <div className="text-sm text-gray-600">
                                {settlement.group?.name && `${settlement.group.name} • `}
                                {new Date(settlement.createdAt).toLocaleDateString()}
                                {settlement.description && ` • ${settlement.description}`}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                via {settlementHelpers.getPaymentMethodText(settlement.method)}
                                {settlement.settledAt && ` • Completed ${new Date(settlement.settledAt).toLocaleDateString()}`}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              {settlementHelpers.formatCurrency(settlement.amount)}
                            </p>
                            <Badge className="bg-green-600 mt-2">
                              {settlementHelpers.getSettlementStatusInfo(settlement.status).text}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Pagination for Pending Settlements */}
          {pendingPagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => loadPendingSettlements(Math.max(1, pendingPagination.page - 1))}
                disabled={pendingPagination.page === 1}
                className="rounded-xl"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pendingPagination.page} of {pendingPagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => loadPendingSettlements(Math.min(pendingPagination.totalPages, pendingPagination.page + 1))}
                disabled={pendingPagination.page === pendingPagination.totalPages}
                className="rounded-xl"
              >
                Next
              </Button>
            </div>
          )}

          {/* Pagination for Completed Settlements */}
          {completedPagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => loadCompletedSettlements(Math.max(1, completedPagination.page - 1))}
                disabled={completedPagination.page === 1}
                className="rounded-xl"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {completedPagination.page} of {completedPagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => loadCompletedSettlements(Math.min(completedPagination.totalPages, completedPagination.page + 1))}
                disabled={completedPagination.page === completedPagination.totalPages}
                className="rounded-xl"
              >
                Next
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}