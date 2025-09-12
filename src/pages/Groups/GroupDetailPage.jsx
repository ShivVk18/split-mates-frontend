import { useParams } from "react-router-dom"

export default function GroupDetailsPage() {
  const { id } = useParams()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Group Details</h1>
      <p>Group ID: {id}</p>
      {/* fetch and show group details using id */}
    </div>
  )
}