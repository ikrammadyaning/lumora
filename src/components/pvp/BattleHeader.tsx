import { motion } from "framer-motion"
import { X, Star, Clock } from "lucide-react"

interface BattleHeaderProps {
  mode: string
  timeLeft: number
  playerScore: number
  onExit: () => void
}

const modeLabels: Record<string, { icon: string; label: string }> = {
  "tembak-soal": { icon: "🎯", label: "Tembak Soal" },
  "kilat-menjawab": { icon: "⚡", label: "Kilat Menjawab" },
  "teka-teki-silang": { icon: "🔤", label: "Teka-Teki Silang" },
  "koreksi-kalimat": { icon: "✏️", label: "Koreksi Kalimat" },
}

export default function BattleHeader({ mode, timeLeft, playerScore, onExit }: BattleHeaderProps) {
  const info = modeLabels[mode] || { icon: "⚔️", label: mode }
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  const isLow = timeLeft <= 30

  return (
    <header className="fixed top-0 left-0 right-0 z-50 lg:pl-[260px]">
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 px-4 py-3 flex items-center justify-between shadow-lg">
        <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xl">{info.icon}</span>
          <span className="text-white font-bold text-sm">{info.label}</span>
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
            <Clock className={`w-4 h-4 ${isLow ? "text-red-400" : "text-white"}`} />
            <span className={`font-mono font-bold text-sm ${isLow ? "text-red-400" : "text-white"}`}>
              {timeStr}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white font-bold">{playerScore}</span>
        </div>
      </div>
    </header>
  )
}
