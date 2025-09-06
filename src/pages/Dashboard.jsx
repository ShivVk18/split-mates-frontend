
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  BarChart3,
  Settings,
  Plus,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  Filter,
  Download
} from "lucide-react"
import ExpensesPage from "./ExpensePage"
import FriendsPage from "./FriendsPage"
import GroupsPage from "./GroupPage"
// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
}







const ReportsPage = () => (
  <motion.div {...fadeInUp} className="p-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
        Reports
      </h2>
      <p className="text-slate-600 mb-8">View detailed expense reports and analytics.</p>
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardContent className="p-8">
          <p className="text-slate-500 text-center">Reports interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </motion.div>
)

const SettingsPage = () => (
  <motion.div {...fadeInUp} className="p-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
        Settings
      </h2>
      <p className="text-slate-600 mb-8">Configure your account settings.</p>
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardContent className="p-8">
          <p className="text-slate-500 text-center">Settings interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </motion.div>
)

const SettlementsPage = () => (
  <motion.div {...fadeInUp} className="p-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
        Settlements
      </h2>
      <p className="text-slate-600 mb-8">Manage payments and settlements.</p>
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardContent className="p-8">
          <p className="text-slate-500 text-center">Settlements interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </motion.div>
)

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "friends", label: "Friends", icon: Users },
    { id: "groups", label: "Groups", icon: Users },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "settlements", label: "Settlements", icon: CreditCard },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "friends": return <FriendsPage />
      case "groups": return <GroupsPage />
      case "expenses": return <ExpensesPage />
      case "settlements": return <SettlementsPage />
      case "reports": return <ReportsPage />
      case "settings": return <SettingsPage />
      default: return <DashboardHome />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Enhanced Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed left-0 top-0 h-full ${isSidebarCollapsed ? 'w-20' : 'w-80'} bg-white/90 backdrop-blur-xl border-r border-slate-200/60 z-50 transition-all duration-300 shadow-2xl shadow-slate-900/5`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/50">
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center shadow-lg shadow-blue-600/25">
                <span className="text-white font-bold text-sm">SM</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  SplitMates
                </h2>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
            </motion.div>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-9 h-9 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 rounded-xl"
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <div className="space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg shadow-blue-600/25"
                      : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <div className={`flex items-center justify-center w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="font-medium text-[15px]">{item.label}</span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl -z-10"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        {!isSidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-6 left-4 right-4"
          >
            <Card className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 border-slate-200/50 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-11 h-11 border-2 border-white shadow-md">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold text-sm">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">John Doe</p>
                    <p className="text-xs text-slate-600 truncate">john@example.com</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-lg"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Top Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`fixed top-0 right-0 ${isSidebarCollapsed ? 'left-20' : 'left-80'} h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 z-40 transition-all duration-300`}
      >
        <div className="flex items-center justify-between h-full px-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search expenses, friends, groups..." 
                className="pl-11 pr-4 py-3 bg-slate-100/80 border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white/80 w-96 transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative w-10 h-10 hover:bg-slate-100/80 rounded-2xl"
            >
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-white"></span>
            </Button>
            <Badge className="bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 border border-blue-200/50 px-3 py-1.5 rounded-xl font-medium">
              <Sparkles className="h-3 w-3 mr-1.5" />
              Pro Plan
            </Badge>
            <Avatar className="w-9 h-9 border-2 border-slate-200 shadow-sm">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold text-sm">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className={`${isSidebarCollapsed ? 'ml-20' : 'ml-80'} pt-20 transition-all duration-300`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Enhanced Dashboard Home Component
function DashboardHome() {
  const recentExpenses = [
    { id: 1, title: "Dinner at Italian Restaurant", amount: 120.50, group: "Weekend Trip", date: "Jan 15", category: "Food", color: "emerald" },
    { id: 2, title: "Uber to Airport", amount: 45.20, group: "Weekend Trip", date: "Jan 14", category: "Transport", color: "blue" },
    { id: 3, title: "Grocery Shopping", amount: 89.75, group: "Roommates", date: "Jan 13", category: "Food", color: "emerald" },
    { id: 4, title: "Movie Tickets", amount: 32.00, group: "Friends", date: "Jan 12", category: "Entertainment", color: "purple" },
  ]

  const balanceSummary = [
    { name: "Alice Johnson", amount: 45.50, type: "owes", avatar: "AJ", color: "blue" },
    { name: "Bob Smith", amount: 23.75, type: "owes", avatar: "BS", color: "teal" },
    { name: "Charlie Brown", amount: 67.25, type: "owed", avatar: "CB", color: "emerald" },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-10"
      >
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent mb-3">
            Welcome back, John!
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Here's your expense overview for today. You have 3 pending settlements and 2 new group invitations.
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-6 py-2.5 rounded-2xl font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl px-6 py-2.5 rounded-2xl font-medium transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10"
      >
        {[
          { label: "Total Expenses", value: "$2,847.50", icon: DollarSign, color: "blue", trend: "+12.5%" },
          { label: "You're Owed", value: "$136.50", icon: ArrowDownLeft, color: "emerald", trend: "+$23.00" },
          { label: "You Owe", value: "$69.25", icon: ArrowUpRight, color: "red", trend: "-$15.25" },
          { label: "Active Groups", value: "6", icon: Users, color: "purple", trend: "+2 new" }
        ].map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r from-${stat.color}-100 to-${stat.color}-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <Badge variant="outline" className={`text-xs border-${stat.color}-200 text-${stat.color}-600 bg-${stat.color}-50`}>
                    {stat.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Recent Expenses */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-blue-600" />
                    Recent Expenses
                  </CardTitle>
                  <CardDescription className="mt-1">Your latest shared expenses</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 rounded-xl">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {recentExpenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 hover:bg-white/80 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r from-${expense.color}-100 to-${expense.color}-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Receipt className={`h-4 w-4 text-${expense.color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900 truncate">{expense.title}</h4>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {expense.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {expense.group} • {expense.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">${expense.amount.toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Balance Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg h-full">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Balance Summary
                </CardTitle>
                <CardDescription className="mt-1">Who owes what</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {balanceSummary.map((balance, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 hover:bg-white/80 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="w-11 h-11 border-2 border-white shadow-md">
                        <AvatarFallback className={`bg-gradient-to-r from-${balance.color}-600 to-${balance.color}-700 text-white font-semibold text-sm`}>
                          {balance.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{balance.name}</p>
                        <p className="text-sm text-slate-600">
                          {balance.type === "owes" ? "Owes you" : "You owe"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className={`text-lg font-bold ${balance.type === "owed" ? "text-emerald-600" : "text-red-600"}`}>
                          ${balance.amount.toFixed(2)}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className={`rounded-xl text-xs font-medium ${
                          balance.type === "owed" 
                            ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" 
                            : "border-red-200 text-red-700 hover:bg-red-50"
                        }`}
                      >
                        {balance.type === "owed" ? "Request" : "Pay"}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-gradient-to-r from-blue-50/80 to-teal-50/80 backdrop-blur-sm border-blue-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              AI Insights
            </CardTitle>
            <CardDescription>Smart recommendations based on your spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-200/30 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-100 to-teal-200 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-teal-600" />
                  </div>
                  <h4 className="font-semibold text-teal-800">Achievement Unlocked</h4>
                </div>
                <p className="text-teal-700 text-sm leading-relaxed">
                  Great job! Your settlement rate improved by 15% this month. You're getting better at staying on top of shared expenses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}