import { motion } from "framer-motion"

interface Mapel {
  id: string
  nama: string
  icon: string
}

interface MapelSelectCardProps {
  mapel: Mapel
  selected: boolean
  onSelect: () => void
}

const mapelBg: Record<string, string> = {
  "aqidah-dasar": "bg-blue-100",
  "nahwu-level-1": "bg-emerald-100",
  "shorof-level-1": "bg-purple-100",
  "fiqh-ibadah": "bg-green-100",
  "tajwid-tahsin": "bg-rose-100",
  "adab-akhlaq": "bg-amber-100",
  "sirah-nabawiyah": "bg-indigo-100",
  "tafsir-juz-amma": "bg-slate-100",
}

export default function MapelSelectCard({ mapel, selected, onSelect }: MapelSelectCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? "border-rose-400 bg-rose-50 shadow-sm"
          : "border-gray-100 hover:border-gray-300 bg-white"
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mapelBg[mapel.id] || "bg-gray-100"}`}>
        <span className="text-xl">{mapel.icon}</span>
      </div>
      <span className="font-bold text-gray-900 text-sm text-center leading-snug">{mapel.nama}</span>
    </motion.button>
  )
}
