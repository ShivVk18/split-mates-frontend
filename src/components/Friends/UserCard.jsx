import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { friendService } from "@/services/friend-service"
import { toast } from "sonner"


export function UserCard({ user, onChanged }) {
 

  const onSend = async () => {
    try {
      await friendService.sendFriendRequest(user.email)
      toast("Friend request sent.")
      onChanged?.()
    } catch (e) {
      toast("Please try again.")
    }
  }

  const onAccept = async (friendId) => {
    try {
      await friendService.acceptFriendRequest(friendId)
      toast("Friend request accepted." )
      onChanged?.()
    } catch (e) {
      toast("Please try again.")
    }
  }

  const onDecline = async (friendId) => {
    try {
      await friendService.declineFriendRequest(friendId)
      toast("Friend request declined.")
      onChanged?.()
    } catch (e) {
      toast("Please try again.")
    }
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
          <span className="text-blue-700 font-semibold">
            {user.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "U"}
          </span>
        </div>
        <div>
          <p className="font-medium text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-600">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {user.relationStatus === "friends" && (
          <Badge variant="outline" className="rounded-xl">
            Friends
          </Badge>
        )}
        {user.relationStatus === "request_sent" && (
          <Badge variant="outline" className="rounded-xl">
            Requested
          </Badge>
        )}
        {user.relationStatus === "request_received" && (
          <>
            <Button size="sm" className="rounded-xl" onClick={() => onAccept(user.id)}>
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl bg-transparent"
              onClick={() => onDecline(user.id)}
            >
              Decline
            </Button>
          </>
        )}
        {user.relationStatus === "none" && (
          <Button size="sm" className="rounded-xl" onClick={onSend}>
            Add
          </Button>
        )}
      </div>
    </div>
  )
}