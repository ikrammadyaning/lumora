import { useNavigate } from "react-router-dom"
import { Plus, LogIn, ArrowRight } from "lucide-react"

interface PvpActionCardProps {
  type: "create" | "join"
}

export default function PvpActionCard({ type }: PvpActionCardProps) {
  const navigate = useNavigate()
  const isCreate = type === "create"

  return (
    <div className="rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          isCreate
            ? "bg-gradient-to-br from-orange-500 to-red-500"
            : "bg-gradient-to-br from-blue-500 to-purple-500"
        }`}
      >
        {isCreate ? <Plus className="w-6 h-6 text-white" /> : <LogIn className="w-6 h-6 text-white" />}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        {isCreate ? "Buat Room Baru" : "Gabung Room"}
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        {isCreate
          ? "Pilih pelajaran, buat room, undang teman-temanmu untuk bertarung"
          : "Masukkan kode room dari temanmu dan langsung bertarung!"}
      </p>
      <button
        onClick={() => (isCreate ? navigate("/pvp-battle/buat-room") : navigate("/pvp-battle/gabung-room"))}
        className={`text-sm font-bold flex items-center gap-1 transition-colors ${
          isCreate ? "text-red-500 hover:text-red-600" : "text-blue-500 hover:text-blue-600"
        }`}
      >
        {isCreate ? "Mulai Sekarang" : "Masukkan Kode"} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
