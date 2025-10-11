import { useEffect, useState } from "react"
import {motion} from  'motion/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Mail, Sparkles, UserPlus, Inbox } from "lucide-react"

import { cn } from "@/lib/utils"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { friendService } from "@/services/friendService"
import { userService } from "@/services/userService"
import Suggestions from "@/components/Friends/Suggestion"
import PendingRequests from "@/components/Friends/PendingRequest"
import FriendsList from "@/components/Friends/FriendList"
import { toast } from "sonner"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
}

export default function FriendsPage() {
  

  // Email search (separate from general search)
  const [emailQuery, setEmailQuery] = useState("")
  const debouncedEmail = useDebouncedValue(emailQuery, 400)

  const [emailResult, setEmailResult] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [emailLoading, setEmailLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setEmailError(null)
      if (!debouncedEmail || debouncedEmail.length <= 3) {
        setEmailResult(null)
        return
      }
      setEmailLoading(true)
      try {
        const res = await userService.searchByEmail(debouncedEmail)
        if (!cancelled) setEmailResult(res?.data ?? res ?? null)
      } catch (e) {
        if (!cancelled) setEmailError(e?.message || "Failed to search")
      } finally {
        if (!cancelled) setEmailLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [debouncedEmail])

  const onSendRequestFromEmail = async () => {
    try {
      await friendService.sendFriendRequest(emailQuery)
      toast( "Your friend request has been sent.")
      // refresh relation status
      if (debouncedEmail && debouncedEmail.length > 3) {
        const res = await userService.searchByEmail(debouncedEmail)
        setEmailResult(res?.data ?? res ?? null)
      }
    } catch (e) {
      toast("Unable to send request")
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8"
      >
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent mb-2">
            Friends
          </h1>
          <p className="text-slate-600">Find friends, manage requests, and grow your circle.</p>
        </div>
        <div className="flex gap-3">
        
        </div>
      </motion.div>

      {/* Top summary tiles */}
      <motion.div
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {[
          { label: "All Friends", icon: Users, color: "blue", href: "#friends-section" },
          { label: "Pending Requests", icon: Inbox, color: "emerald", href: "#pending-section" },
          { label: "Suggestions", icon: Sparkles, color: "purple", href: "#suggestions-section" },
        ].map((item, idx) => (
          <motion.div key={idx} variants={fadeInUp}>
            <Card className="bg-white backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      `w-12 h-12 rounded-2xl bg-gradient-to-r from-${item.color}-100 to-${item.color}-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`,
                    )}
                  >
                    <item.icon className={cn(`h-6 w-6 text-${item.color}-600`)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600">Quick Access</p>
                  <button
                    className={cn(`text-2xl font-bold text-${item.color}-600 hover:underline`)}
                    onClick={() => {
                      const el = document.querySelector(item.href)
                      ;(el)?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }}
                  >
                    {item.label}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Email Search */}
      <motion.div id="search-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-white backdrop-blur-sm border-slate-200 shadow-lg mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Search by Email
            </CardTitle>
            <CardDescription>Find a specific user by their email address.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={emailQuery}
                  onChange={(e) => setEmailQuery(e.target.value)}
                  placeholder="name@example.com"
                  className="pl-9 rounded-xl"
                />
              </div>
              <Button
                disabled={!emailResult?.user || emailResult?.relationStatus === "friends" || emailLoading}
                onClick={onSendRequestFromEmail}
                className="rounded-xl"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Send Request
              </Button>
            </div>

            {/* Result */}
            <div className="mt-4">
              {emailLoading && <p className="text-slate-500 text-sm">Searching...</p>}
              {emailError && <p className="text-red-600 text-sm">Failed to search. {emailError}</p>}
              {emailResult?.user && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                      <span className="text-blue-700 font-semibold">
                        {emailResult.user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{emailResult.user.name}</p>
                      <p className="text-sm text-slate-600">{emailResult.user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-xl">
                    {emailResult.relationStatus === "friends"
                      ? "Friends"
                      : emailResult.relationStatus === "request_sent"
                        ? "Requested"
                        : emailResult.relationStatus === "request_received"
                          ? "Requested you"
                          : "Not friends"}
                  </Badge>
                </div>
              )}
              {!emailLoading && debouncedEmail && !emailResult?.user && (
                <p className="text-slate-500 text-sm">No user found for that email.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Suggestions + Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Suggestions />
        <PendingRequests />
      </div>

      {/* Friends */}
      <div id="friends-section">
        <FriendsList />
      </div>
    </div>
  )
}
