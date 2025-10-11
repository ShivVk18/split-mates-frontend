"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { userService } from "@/services/userService"
import { friendService } from "@/services/friendService"
import { toast } from "sonner"


const Suggestions = () => {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  const load = async () => {
    setLoading(true)
    setErr(null)
    try {
      const res = await userService.getSuggestedUsers(8)
      const list = res?.data ?? res ?? []
      setItems(list)
    } catch (e) {
      setErr(e?.message || "Failed to load suggestions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onSend = async (email) => {
    try {
      await friendService.sendFriendRequest(email)
      toast("Friend request successfully sent." )
      setItems((prev) => prev.filter((u) => u.email !== email))
    } catch (e) {
      toast("Please try again.")
    }
  }

  return (
    <Card id="suggestions-section" className="bg-white backdrop-blur-sm border-slate-200 shadow-lg h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Suggested Users
        </CardTitle>
        <CardDescription>People you may know.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {loading && <p className="text-slate-500 text-sm">Loading suggestions...</p>}
        {err && <p className="text-red-600 text-sm">Failed to load suggestions. {err}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-blue-700 font-semibold">
                    {u.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{u.name}</p>
                  <p className="text-sm text-slate-600">{u.email}</p>
                </div>
              </div>
              <Button size="sm" className="rounded-xl" onClick={() => onSend(u.email)}>
                Add
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Suggestions
