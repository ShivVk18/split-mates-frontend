import { useEffect, useState } from "react"
import { userService } from "@/services/userService"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useDebouncedValue } from "@/hooks/useDebounce"
import { UserCard } from "@/components/Friends/UserCard"

export function SearchUsers() {
  const [query, setQuery] = useState("")
  const debounced = useDebouncedValue(query, 350)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setErr(null)
      if (!debounced || debounced.trim().length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const res = await userService.searchUsers(debounced, 1, 10)
        const users = res?.data?.users ?? res?.users ?? []
        if (!cancelled) setResults(users)
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to search")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [debounced])

  const refetch = async () => {
    if (!debounced || debounced.trim().length < 2) return
    try {
      const res = await userService.searchUsers(debounced, 1, 10)
      const users = res?.data?.users ?? res?.users ?? []
      setResults(users)
    } catch {}
  }

  return (
    <Card className="bg-card border border-border/80 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Search className="h-5 w-5 text-orange-500" />
          Search Users
        </CardTitle>
        <CardDescription className="text-muted-foreground">Type at least 2 characters to search by name, username, or email.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people..."
            className="pl-10 h-11 border-border/80 bg-muted/30 focus:bg-background text-foreground rounded-xl outline-none"
          />
        </div>

        {loading && <p className="text-sm text-muted-foreground">Searching...</p>}
        {err && <p className="text-sm text-red-500">Failed to search. {err}</p>}

        <div className="space-y-3">
          {results.map((u) => (
            <UserCard key={u.id} user={u} onChanged={refetch} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}