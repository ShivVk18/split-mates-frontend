import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { friendService } from "@/services/friendService"
import { useThrottle as useThrottleHook } from "@/hooks/useThrottle"
import { toast } from "sonner"


export function FriendsList() {
 

  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(null)
  const [loading, setLoading] = useState(false)

  const hasMore = total == null ? true : items.length < total

  const loadPage = async (nextPage) => {
    setLoading(true)
    try {
      const res = await friendService.getAllFriends({ page: nextPage, limit: 10 })
      const friends = res?.data?.friends ?? res?.friends ?? []
      const totalCount = res?.data?.totalCount ?? res?.totalCount ?? null
      setItems((prev) => (nextPage === 1 ? friends : [...prev, ...friends]))
      if (totalCount !== null) setTotal(totalCount)
    } catch (e) {
      console.log("[v0] Friends load error:", e?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPage(1)
  }, [])

  const { throttled } = useThrottleHook(() => {
    if (!loading && hasMore) {
      const next = page + 1
      setPage(next)
      loadPage(next)
    }
  }, 700)

  const loaderRef = useRef(null)
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) throttled()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [loaderRef.current, throttled])

  const onRemove = async (friendId) => {
    try {
      await friendService.removeFriend(friendId)
      toast("Friend removed successfully.")
      setItems((prev) => prev.filter((f) => f.id !== friendId))
      if (total !== null) setTotal((t) => (t ? t - 1 : t))
    } catch (e) {
      toast( "Please try again.")
    }
  }

  return (
    <Card className="bg-white backdrop-blur-sm border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Your Friends
        </CardTitle>
        <CardDescription>Browse and manage your friends.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length === 0 && !loading && <div className="text-center py-10 text-slate-500">No friends yet</div>}
        <div className="space-y-3">
          {items.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-100 to-teal-200 flex items-center justify-center">
                  <span className="text-teal-700 font-semibold">
                    {f.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{f.name}</p>
                  <p className="text-sm text-slate-600">{f.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl bg-transparent" onClick={() => onRemove(f.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* Load more sentinel */}
        <div ref={loaderRef} className="h-10 w-full flex items-center justify-center">
          {hasMore && <span className="text-slate-400 text-sm">{loading ? "Loading..." : "Scroll to load more"}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

export default FriendsList
