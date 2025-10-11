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
      toast("Friend request accepted." )
      setRequests((prev) => prev.filter((r) => r.user?.id !== friendId))
    } catch (e) {
      toast( "Please try again.")
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
    <Card id="pending-section" className="bg-white backdrop-blur-sm border-slate-200 shadow-lg h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Inbox className="h-5 w-5 text-blue-600" />
          Pending Requests
        </CardTitle>
        <CardDescription>Manage incoming friend requests.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {loading && <p className="text-slate-500 text-sm">Loading...</p>}
        {err && <p className="text-red-600 text-sm">Failed to load. {err}</p>}

        <div className="space-y-3">
          {requests.length === 0 && !loading && (
            <div className="text-center py-10 text-slate-500">No pending requests</div>
          )}
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold">
                    {req.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{req.user?.name}</p>
                  <p className="text-sm text-slate-600">{req.user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="rounded-xl" onClick={() => onAccept(req.user.id)}>
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl bg-transparent"
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
