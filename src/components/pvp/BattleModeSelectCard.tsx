import { motion } from "framer-motion"

interface BattleMode {
  id: string
  nama: string
  icon: string
  description: string
}

interface BattleModeSelectCardProps {
  mode: BattleMode
  selected: boolean
  onSelect: () => void
}

const modeStyle: Record<string, { bg: string; border: string; tint: string }> = {
  "tembak-soal": { bg: "bg-orange-500", border: "border-red-500", tint: "bg-red-50" },
  "kilat-menjawab": { bg: "bg-yellow-400", border: "border-orange-500", tint: "bg-orange-50" },
  "teka-teki-silang": { bg: "bg-blue-500", border: "border-blue-500", tint: "bg-blue-50" },
  "koreksi-kalimat": { bg: "bg-emerald-500", border: "border-emerald-500", tint: "bg-emerald-50" },
}

export default function BattleModeSelectCard({ mode, selected, onSelect }: BattleModeSelectCardProps) {
  const s = modeStyle[mode.id]
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 w-full ${
        selected
          ? `${s.border} ${s.tint} shadow-sm`
          : "border-gray-100 hover:border-gray-300 hover:shadow-md bg-white"
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
        <span className="text-2xl">{mode.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 text-sm">{mode.nama}</h4>
        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{mode.description}</p>
      </div>
    </motion.button>
  )
}
