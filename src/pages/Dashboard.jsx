import { useEffect, useState, useCallback, useMemo } from "react";
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
  Download,
  TrendingUp
} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { useAuthStore } from "@/stores/userStore";
import { toast } from "sonner";
import useSEO from "@/hooks/useSEO";
import CreateSettlementForm from "@/components/Settlement/SettlementForm";
import settlementService from "@/services/settlementService";

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
  useSEO({
    title: "Dashboard",
    description: "View SplitMates dashboard. Manage your balances, settle up debts, record expenses, and check automated insights."
  });

  const [data, loading, error, refetchExpenses] = useFetch('/expenses/');  
  const [balanceData, balanceLoading, balanceError, refetchBalance] = useFetch('/settlements/balance');
  const [groupData] = useFetch('/groups/');

  const { user } = useAuthStore.getState();
  const [totalExpense, setTotalExpense] = useState(0);
  const [balanceSummary, setBalanceSummary] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [preselectedFriendId, setPreselectedFriendId] = useState("");
  const [preselectedAmount, setPreselectedAmount] = useState("");
  const [settlementLoading, setSettlementLoading] = useState(false);
  const [requestingFriendId, setRequestingFriendId] = useState(null);

  const handlePay = useCallback((friendId, amount) => {
    setPreselectedFriendId(friendId);
    setPreselectedAmount(amount.toString());
    setShowSettlementModal(true);
  }, []);

  const handleRequest = useCallback((friendId, friendName, amount) => {
    setRequestingFriendId(friendId);
    setTimeout(() => {
      setRequestingFriendId(null);
      toast.success(`Reminder notification sent to ${friendName} for ₹${amount.toLocaleString()}`);
    }, 1000);
  }, []);

  const handleSettlementSubmit = async (formData) => {
    setSettlementLoading(true);
    try {
      const response = await settlementService.createSettlement(formData);
      if (response.statusCode === 201) {
        toast.success("Settlement Created Successfully");
        setShowSettlementModal(false);
        refetchExpenses();
        refetchBalance();
      }
    } catch (error) {
      toast.error(error.message || "Failed to create settlement");
    } finally {
      setSettlementLoading(false);
    }
  };

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
        id: rel.user.id,
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-xs text-muted-foreground">Manage your group shares and track balances</p>
        </div>

        <div className="flex gap-3">
          <Button 
            className="bg-foreground text-background hover:bg-foreground/90 font-bold px-6 py-2.5 rounded-full transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-2 text-xs"
            onClick={() => window.location.href = '/expenses'}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Expense
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
      >
        {[
          { label: "Total Expenses", value: `₹${totalExpense.toLocaleString()}`, icon: DollarSign, textColor: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-500/10" },
          { label: "You're Owed", value: `₹${(balanceData?.totalOwed || 0).toLocaleString()}`, icon: ArrowDownLeft, textColor: "text-foreground", bgColor: "bg-muted" },
          { label: "You Owe", value: `₹${(balanceData?.totalOwing || 0).toLocaleString()}`, icon: ArrowUpRight, textColor: "text-foreground", bgColor: "bg-muted" },
          { label: "Active Groups", value: `${groupData?.totalGroups || 0}`, icon: Users, textColor: "text-foreground", bgColor: "bg-muted" }
        ].map((stat, index) => (
          <motion.div 
            key={index} 
            variants={fadeInUp}
            whileHover={{ y: -5, rotateX: 2.5, rotateY: -1.5, transition: { duration: 0.2, ease: "easeOut" } }}
            style={{ perspective: 1000 }}
            className="transform-gpu cursor-default"
          >
            <Card className="bg-card border-border hover:shadow-xs transition-all duration-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
                  <stat.icon className="h-4.5 w-4.5 text-foreground" />
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
          <Card className="bg-card border-border shadow-xs h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-orange-500" />
                    Recent Expenses
                  </CardTitle>
                  <CardDescription className="mt-1">Your latest shared expenses</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground rounded-xl"
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
                  <Receipt className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
                  <p className="text-muted-foreground">No expenses yet</p>
                  <p className="text-sm text-muted-foreground/80 mt-1">Start by adding your first expense</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentExpenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 hover:border-border transition-all duration-200 group cursor-pointer"
                      onClick={() => window.location.href = `/expenses/${expense.id}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <Receipt className={`h-4 w-4 text-orange-500`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground truncate">{expense.title}</h4>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {expense.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {expense.group} • {expense.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">₹{expense.amount.toFixed(2)}</p>
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
          <Card className="bg-card border-border shadow-xs h-full">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-foreground" />
                  Balance Summary
                </CardTitle>
                <CardDescription className="mt-1">Who owes what</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {balanceSummary.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
                    <p className="text-muted-foreground">All settled up! 🎉</p>
                    <p className="text-sm text-muted-foreground/80 mt-1">No outstanding balances</p>
                  </div>
                ) : (
                  balanceSummary.map((balance, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 hover:border-border transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-11 h-11 border border-border shadow-md">
                          <AvatarFallback
                            className={`bg-foreground text-background font-semibold text-sm`}
                          >
                            {balance.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{balance.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {balance.type === "owes" ? "Owes you" : "You owe"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p
                            className={`text-lg font-bold ${
                              balance.type === "owed" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            ₹{balance.amount.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={requestingFriendId === balance.id}
                          className={`rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 ${
                            balance.type === "owed"
                              ? "border-green-500/20 text-green-600 hover:bg-green-500/10"
                              : "border-red-500/20 text-red-600 hover:bg-red-500/10"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (balance.type === "owed") {
                              handleRequest(balance.id, balance.name, balance.amount);
                            } else {
                              handlePay(balance.id, balance.amount);
                            }
                          }}
                        >
                          {requestingFriendId === balance.id && (
                            <span className="w-3.5 h-3.5 border-2 border-green-600 border-t-transparent rounded-full animate-spin shrink-0" />
                          )}
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

      {/* Insights */}
      {balanceSummary.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-card border-border shadow-xs">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Insights
              </CardTitle>
              <CardDescription>Quick summary of your expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-muted rounded-2xl border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h4 className="font-semibold text-foreground">Activity Summary</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    You have {balanceSummary.length} active {balanceSummary.length === 1 ? 'balance' : 'balances'} with friends. 
                    Keep tracking your expenses to stay organized!
                  </p>
                </div>
                
                {recentExpenses.length > 0 && (
                  <div className="p-6 bg-muted rounded-2xl border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-foreground" />
                      </div>
                      <h4 className="font-semibold text-foreground">Recent Activity</h4>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Latest expense: {recentExpenses[0].title} for ₹{recentExpenses[0].amount.toFixed(2)} 
                      {recentExpenses[0].group !== "Personal" && ` in ${recentExpenses[0].group}`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showSettlementModal && (
        <CreateSettlementForm
          onClose={() => setShowSettlementModal(false)}
          onSubmit={handleSettlementSubmit}
          groups={groupData?.groups || []}
          balanceData={balanceData}
          loading={settlementLoading}
          preselectedFriendId={preselectedFriendId}
          preselectedAmount={preselectedAmount}
        />
      )}
    </div>
  );
}