"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus } from "lucide-react"
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
      toast("Friend request successfully sent.")
      setItems((prev) => prev.filter((u) => u.email !== email))
    } catch (e) {
      toast("Please try again.")
    }
  }

  return (
    <Card id="suggestions-section" className="bg-card border-border shadow-xs h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <UserPlus className="h-4.5 w-4.5 text-orange-600 dark:text-orange-400" />
          Suggested Users
        </CardTitle>
        <CardDescription>People you may know.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {loading && <p className="text-muted-foreground text-xs">Loading suggestions...</p>}
        {err && <p className="text-destructive text-xs">Failed to load suggestions. {err}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/80 border border-border transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                    {u.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-xs truncate">{u.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                </div>
              </div>
              <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full text-xs px-4 cursor-pointer" onClick={() => onSend(u.email)}>
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
