import { Navigate } from "react-router-dom"
import { useUser } from "@/context/UserContext"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2e2a] flex items-center justify-center">
        <p className="text-white/60 text-sm">Memuat...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
