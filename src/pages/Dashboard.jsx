import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  Receipt,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Sparkles,
  Filter,
  Download
} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { useAuthStore } from "@/stores/userStore";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export default function Dashboard() {  
  const [data, loading, error] = useFetch('/expenses/');  
  const [balanceData] = useFetch('/settlements/balance');
  const [groupData] = useFetch('/groups/');

  
  
  const { user } = useAuthStore.getState();
  const [totalExpense, setTotalExpense] = useState(0);
  const [balanceSummary, setBalanceSummary] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    if (data) {
      setTotalExpense(data?.totalExpenseAmount || 0);
      
      // Format recent expenses from API
      if (data?.expenses) {
        const formatted = data.expenses.slice(0, 4).map(expense => {
          // Get category color based on tags or default
          const categoryColor = expense.tags?.[0]?.tag?.color || getCategoryColor(expense.description);
          
          return {
            id: expense.id,
            title: expense.description,
            amount: expense.amount,
            group: expense.group?.name || "Personal",
            date: formatDate(expense.date),
            category: expense.tags?.[0]?.tag?.name || getCategoryName(expense.description),
            color: categoryColor
          };
        });
        setRecentExpenses(formatted);
      }
    }
  }, [data]);

  useEffect(() => {
    if (balanceData?.relationships) {
      const summary = balanceData.relationships.map(rel => ({
        name: rel.user.name,
        amount: Math.abs(rel.netBalance),
        type: rel.netBalance < 0 ? "owes" : "owed",
        avatar: rel.user.name
          .split(" ")
          .map(n => n[0])
          .join(""),
        color: rel.netBalance < 0 ? "red" : "emerald",
      }));
      setBalanceSummary(summary);
    }
  }, [balanceData]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Helper function to get category color based on description
  const getCategoryColor = (description) => {
    const lower = description.toLowerCase();
    if (lower.includes('food') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('grocery')) return "emerald";
    if (lower.includes('transport') || lower.includes('uber') || lower.includes('taxi') || lower.includes('gas')) return "blue";
    if (lower.includes('movie') || lower.includes('entertainment') || lower.includes('game')) return "purple";
    if (lower.includes('rent') || lower.includes('utilities')) return "orange";
    return "slate";
  };

  // Helper function to get category name based on description
  const getCategoryName = (description) => {
    const lower = description.toLowerCase();
    if (lower.includes('food') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('grocery')) return "Food";
    if (lower.includes('transport') || lower.includes('uber') || lower.includes('taxi') || lower.includes('gas')) return "Transport";
    if (lower.includes('movie') || lower.includes('entertainment') || lower.includes('game')) return "Entertainment";
    if (lower.includes('rent') || lower.includes('utilities')) return "Utilities";
    return "Other";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
          <p className="text-red-600 text-lg font-medium">❌ Error loading dashboard</p>
          <p className="text-red-500 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

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
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
        </div>

        <div className="flex gap-3">
  
          <Button 
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl px-6 py-2.5 rounded-2xl font-medium transition-all duration-200"
            onClick={() => console.log("Button clicked")}
          >
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
          { label: "Total Expenses", value: `$${totalExpense.toFixed(2)}`, icon: DollarSign, color: "blue" },
          { label: "You're Owed", value: `$${balanceData?.totalOwed || 0}`, icon: ArrowDownLeft, color: "emerald" },
          { label: "You Owe", value: `$${balanceData?.totalOwing || 0}`, icon: ArrowUpRight, color: "red" },
          { label: "Active Groups", value: `${groupData?.totalGroups || 0}`, icon: Users, color: "purple" }
        ].map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="bg-white backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r from-${stat.color}-100 to-${stat.color}-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
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
          <Card className="bg-white backdrop-blur-sm border-slate-200 shadow-lg h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-blue-600" />
                    Recent Expenses
                  </CardTitle>
                  <CardDescription className="mt-1">Your latest shared expenses</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-500 hover:text-slate-700 rounded-xl"
                  onClick={() => window.location.href = '/expenses'}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {recentExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No expenses yet</p>
                  <p className="text-sm text-slate-400 mt-1">Start by adding your first expense</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentExpenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 group cursor-pointer"
                      onClick={() => window.location.href = `/expenses/${expense.id}`}
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
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Balance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white backdrop-blur-sm border-slate-200 shadow-lg h-full">
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
                {balanceSummary.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">All settled up! 🎉</p>
                    <p className="text-sm text-slate-400 mt-1">No outstanding balances</p>
                  </div>
                ) : (
                  balanceSummary.map((balance, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-11 h-11 border-2 border-white shadow-md">
                          <AvatarFallback
                            className={`bg-gradient-to-r from-${balance.color}-600 to-${balance.color}-700 text-white font-semibold text-sm`}
                          >
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
                          <p
                            className={`text-lg font-bold ${
                              balance.type === "owed" ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights */}
      {balanceSummary.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-r from-blue-50 to-teal-50 backdrop-blur-sm border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Insights
              </CardTitle>
              <CardDescription>Quick summary of your expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-white backdrop-blur-sm rounded-2xl border border-teal-200 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-100 to-teal-200 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-teal-600" />
                    </div>
                    <h4 className="font-semibold text-teal-800">Activity Summary</h4>
                  </div>
                  <p className="text-teal-700 text-sm leading-relaxed">
                    You have {balanceSummary.length} active {balanceSummary.length === 1 ? 'balance' : 'balances'} with friends. 
                    Keep tracking your expenses to stay organized!
                  </p>
                </div>
                
                {recentExpenses.length > 0 && (
                  <div className="p-6 bg-white backdrop-blur-sm rounded-2xl border border-blue-200 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-blue-800">Recent Activity</h4>
                    </div>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      Latest expense: {recentExpenses[0].title} for ${recentExpenses[0].amount.toFixed(2)} 
                      {recentExpenses[0].group !== "Personal" && ` in ${recentExpenses[0].group}`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}