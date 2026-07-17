import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Menu,
  X,
  TrendingUp
} from "lucide-react";
import { useAuthStore } from "@/stores/userStore";
import api from "@/utils/AxiosInstance";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { toast } from "sonner";

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();  

  const { user, logout } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchNotificationsList = async () => {
    try {
      const res = await api.get('/notifications');
      const list = res.data?.data?.notifications || res.data?.notifications || [];
      setNotifications(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBellClick = async () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState) {
      setLoadingNotifications(true);
      await fetchNotificationsList();
      setLoadingNotifications(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      if (unreadIds.length > 0) {
        await api.post('/notifications/mark-read', { notificationIds: unreadIds });
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success("Notifications marked as read");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerTestNotification = async () => {
    try {
      await api.post('/notifications/test-trigger');
      toast.success("Test reminder triggered!");
      await fetchNotificationsList();
      const countRes = await api.get('/notifications/unread-count');
      setUnreadCount(countRes.data?.data?.count || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to trigger test reminder");
    }
  };

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const response = await api.get('/notifications/unread-count');
        if (response.data?.data) {
          setUnreadCount(response.data.data.count || 0);
        }
      } catch (e) {
        console.error("Error fetching unread count:", e);
      }
    };

    if (user) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "friends", label: "Friends", icon: Users, path: "/friends" },
    { id: "groups", label: "Groups", icon: Users, path: "/groups" },
    { id: "expenses", label: "Expenses", icon: Receipt, path: "/expenses" },
    { id: "settlements", label: "Settlements", icon: CreditCard, path: "/settlements" },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    }
    logout();
    navigate("/sign-in");
  };

  const getUserInitials = (userName) => {
    if (!userName) return "US";
    const names = userName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  const userInitials = getUserInitials(user?.name);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } bg-card border-r border-border z-40 transition-all duration-300 shadow-xs`}
      >
        {/* Floating Toggle Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute right-[-10px] top-[22px] z-50 w-5 h-5 bg-card border border-border rounded-full flex items-center justify-center shadow-xs cursor-pointer text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95 transition-all duration-150"
        >
          <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${isSidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>

        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 border-b border-border">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2.5 cursor-pointer w-full" onClick={() => navigate("/dashboard")}>
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                <span className="text-background font-bold text-xs">SM</span>
              </div>
              <span className="font-bold text-sm text-foreground truncate">SplitMates</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shrink-0 mx-auto">
              <span className="text-background font-bold text-xs">SM</span>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center ${
                  isSidebarCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'w-full gap-3 px-3 py-2.5'
                } rounded-xl transition-all duration-150 group relative ${
                  isActive
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar User Footer */}
        <div className="p-3 border-t border-border">
          {isSidebarCollapsed ? (
            <div className="flex justify-center">
              <Avatar className="w-8 h-8 border border-border shadow-xs cursor-pointer" onClick={() => navigate("/settings")}>
                <AvatarFallback className="bg-foreground text-background font-bold text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Avatar className="w-8 h-8 border border-border shadow-xs">
                <AvatarFallback className="bg-foreground text-background font-bold text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="w-7 h-7 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 p-4 flex flex-col justify-between md:hidden shadow-lg"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                      <span className="text-background font-bold text-xs">SM</span>
                    </div>
                    <span className="font-bold text-base text-foreground">SplitMates</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 hover:bg-accent text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                          isActive
                            ? "bg-foreground text-background font-semibold"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5 shrink-0" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarFallback className="bg-foreground text-background font-bold text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-xs truncate">{user?.name || "User"}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header 
        className={`fixed top-0 right-0 ${
          isSidebarCollapsed ? 'md:left-20' : 'md:left-64'
        } left-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-30 transition-all duration-300`}
      >
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-8 h-8 hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
            >
              <Menu className="h-4.5 w-4.5" />
            </Button>

            <div className="relative hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 h-3.5 w-3.5 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search logs, friends..." 
                className="pl-9 pr-4 py-2 bg-muted/60 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:bg-background w-64 md:w-80 transition-all duration-150 text-foreground"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBellClick}
                className="relative w-9 h-9 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-orange-600 animate-pulse" />
                )}
              </Button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">Notifications</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleMarkAllRead} 
                          className="text-[10px] text-orange-600 dark:text-orange-400 hover:underline font-bold cursor-pointer"
                        >
                          Mark all read
                        </button>
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-border">
                      {loadingNotifications ? (
                        <p className="text-center py-6 text-[11px] text-muted-foreground">Loading...</p>
                      ) : notifications.length === 0 ? (
                        <p className="text-center py-6 text-[11px] text-muted-foreground">No notifications yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-3 text-[11px] transition-colors duration-150 ${n.isRead ? 'opacity-70 bg-transparent' : 'bg-muted/30 font-medium'}`}>
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-foreground font-bold">{n.title}</span>
                              <span className="text-[9px] text-muted-foreground shrink-0">
                                {new Date(n.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                              </span>
                            </div>
                            <p className="text-muted-foreground mt-1 leading-normal">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2.5 bg-muted/40 border-t border-border flex justify-center">
                      <button
                        onClick={handleTriggerTestNotification}
                        className="w-full text-center py-1.5 bg-foreground text-background hover:bg-foreground/90 font-bold rounded-lg text-[10px] cursor-pointer transition-all duration-100"
                      >
                        Simulate Test Payment Reminder
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Pro Plan
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main 
        className={`${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        } ml-0 pt-16 transition-all duration-300 min-h-screen bg-background`}
      >
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}