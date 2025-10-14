import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import {
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  X,
  Sparkles
} from "lucide-react";
import { useAuthStore } from "@/stores/userStore";

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();  

  const { user } = useAuthStore.getState();

  console.log(user);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "friends", label: "Friends", icon: Users, path: "/friends" },
    { id: "groups", label: "Groups", icon: Users, path: "/groups" },
    
    { id: "expenses", label: "Expenses", icon: Receipt, path: "/expenses" },
    { id: "settlements", label: "Settlements", icon: CreditCard, path: "/settlements" },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate("/");
  };

  // Fixed: Get user initials properly
  const getUserInitials = (userName) => {
    if (!userName) return "JD";
    const names = userName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  const userInitials = getUserInitials(user?.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Fixed: Added pointer-events-none to background pattern */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} 
      />

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
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={item.path}
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
                  </Link>
                </motion.div>
              );
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
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{user?.name || "User"}</p>
                    <p className="text-xs text-slate-600 truncate">{user?.email || "user@example.com"}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
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
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
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
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area - FIXED */}
      <div className={`${isSidebarCollapsed ? 'ml-20' : 'ml-80'} pt-20 transition-all duration-300 relative z-10`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}