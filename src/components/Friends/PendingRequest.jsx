import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Inbox } from "lucide-react"
import { useEffect, useState } from "react"
import { friendService } from "@/services/friendService"
import { toast } from "sonner"

export function PendingRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  const load = async () => {
    setLoading(true)
    setErr(null)
    try {
      const res = await friendService.getPendingFriendRequests()
      const items = res?.data?.requests ?? res?.requests ?? []
      setRequests(items)
    } catch (e) {
      setErr(e?.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onAccept = async (friendId) => {
    try {
      await friendService.acceptFriendRequest(friendId)
      toast("Friend request accepted.")
      setRequests((prev) => prev.filter((r) => r.user?.id !== friendId))
    } catch (e) {
      toast("Please try again.")
    }
  }

  const onDecline = async (friendId) => {
    try {
      await friendService.declineFriendRequest(friendId)
      toast("Friend request declined.")
      setRequests((prev) => prev.filter((r) => r.user?.id !== friendId))
    } catch (e) {
      toast("Please try again.")
    }
  }

  return (
    <Card id="pending-section" className="bg-card border-border shadow-xs h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <Inbox className="h-4.5 w-4.5 text-foreground" />
          Pending Requests
        </CardTitle>
        <CardDescription>Manage incoming friend requests.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {loading && <p className="text-muted-foreground text-xs">Loading...</p>}
        {err && <p className="text-destructive text-xs">Failed to load. {err}</p>}

        <div className="space-y-3">
          {requests.length === 0 && !loading && (
            <div className="text-center py-10 text-muted-foreground text-xs">No pending requests</div>
          )}
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                    {req.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-xs truncate">{req.user?.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{req.user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full text-xs px-4 cursor-pointer" onClick={() => onAccept(req.user.id)}>
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs px-4 border-border text-foreground hover:bg-accent cursor-pointer"
                  onClick={() => onDecline(req.user.id)}
                >
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PendingRequests
