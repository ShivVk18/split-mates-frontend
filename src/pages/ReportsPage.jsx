import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChartIcon, BarChart3 } from "lucide-react"

export default function ReportsPage() {
  const monthlyData = [
    { month: "Jan", expenses: 1200, settled: 800 },
    { month: "Feb", expenses: 1500, settled: 1200 },
    { month: "Mar", expenses: 900, settled: 900 },
    { month: "Apr", expenses: 1800, settled: 1400 },
    { month: "May", expenses: 2100, settled: 1600 },
    { month: "Jun", expenses: 1600, settled: 1600 },
  ]

  const categoryData = [
    { name: "Food & Dining", value: 45, color: "#3B82F6" },
    { name: "Transportation", value: 20, color: "#10B981" },
    { name: "Entertainment", value: 15, color: "#F59E0B" },
    { name: "Groceries", value: 12, color: "#EF4444" },
    { name: "Other", value: 8, color: "#8B5CF6" },
  ]

  const groupData = [
    { name: "Weekend Trip", total: 1250.5, expenses: 8, trend: "up" },
    { name: "Roommates", total: 2840.75, expenses: 15, trend: "down" },
    { name: "Office Lunch", total: 456.2, expenses: 6, trend: "up" },
    { name: "Friends", total: 789.3, expenses: 4, trend: "up" },
  ]

  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0)
  const totalSettled = monthlyData.reduce((sum, month) => sum + month.settled, 0)
  const settlementRate = ((totalSettled / totalExpenses) * 100).toFixed(1)

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
              Reports & Analytics
            </h1>
            <p className="text-gray-600 text-lg mt-2">Insights into your spending patterns and group activities</p>
          </div>

          <Select defaultValue="6months">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-blue-700">${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Settlement Rate</p>
                  <p className="text-2xl font-bold text-green-600">{settlementRate}%</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg per Month</p>
                  <p className="text-2xl font-bold text-purple-600">${(totalExpenses / 6).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Groups</p>
                  <p className="text-2xl font-bold text-orange-600">{groupData.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-blue-700">Monthly Spending Trends</CardTitle>
                <CardDescription>Expenses vs settlements over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="expenses" fill="#3B82F6" name="Expenses" />
                    <Bar dataKey="settled" fill="#10B981" name="Settled" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-blue-700">Spending by Category</CardTitle>
                <CardDescription>Where your money goes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Group Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-blue-700">Group Performance</CardTitle>
              <CardDescription>Activity and spending by group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupData.map((group, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                        <PieChartIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{group.name}</h3>
                        <p className="text-sm text-gray-600">{group.expenses} expenses this period</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">${group.total.toFixed(2)}</p>
                        <div className="flex items-center gap-1">
                          {group.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <Badge variant={group.trend === "up" ? "default" : "secondary"}>
                            {group.trend === "up" ? "Growing" : "Declining"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-blue-700">Key Insights</CardTitle>
              <CardDescription>AI-powered spending analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2">💡 Spending Tip</h4>
                  <p className="text-green-700 text-sm">
                    Your food & dining expenses are 45% of total spending. Consider setting a monthly budget for
                    restaurant visits.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-2">📈 Trend Alert</h4>
                  <p className="text-blue-700 text-sm">
                    Your settlement rate improved by 15% this month. Great job staying on top of payments!
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <h4 className="font-semibold text-purple-800 mb-2">🎯 Goal Progress</h4>
                  <p className="text-purple-700 text-sm">
                    You're 23% under your monthly spending goal. You have $340 remaining in your budget.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                  <h4 className="font-semibold text-orange-800 mb-2">⚡ Quick Action</h4>
                  <p className="text-orange-700 text-sm">
                    You have 2 pending settlements totaling $112.75. Consider settling these to improve your balance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
