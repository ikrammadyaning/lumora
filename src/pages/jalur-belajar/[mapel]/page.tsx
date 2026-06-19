import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export default function MapelPage() {
  const { mapel } = useParams<{ mapel: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    navigate("/jalur-belajar", { replace: true })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Mengalihkan...</p>
      </div>
    </div>
  )
}
