import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import PvPHeroBanner from "@/components/pvp/PvPHeroBanner"
import PvpActionCard from "@/components/pvp/PvpActionCard"
import BattleModeCard from "@/components/pvp/BattleModeCard"
import NonXpInfoBanner from "@/components/pvp/NonXpInfoBanner"
import { EquippedEffect } from "@/components/EquippedEffect"

const battleModes = [
  { id: "tembak-soal", nama: "Tembak Soal", icon: "🎯", gradient: "from-orange-500 to-red-500" },
  { id: "kilat-menjawab", nama: "Kilat Menjawab", icon: "⚡", gradient: "from-yellow-400 to-orange-500" },
  { id: "teka-teki-silang", nama: "Teka-Teki Silang", icon: "🔤", gradient: "from-blue-500 to-purple-500" },
  { id: "koreksi-kalimat", nama: "Koreksi Kalimat", icon: "✏️", gradient: "from-emerald-500 to-teal-500" },
]

export default function PvpBattlePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <EquippedEffect />
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PvPHeroBanner />
          </motion.div>

          <button
            onClick={() => navigate('/pvp-battle/leaderboard')}
            className="w-full text-left text-sm text-emerald-600 hover:text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 rounded-xl px-4 py-3 transition-colors"
          >
            Lihat Leaderboard PvP →
          </button>

          <div className="grid md:grid-cols-2 gap-4">
            <PvpActionCard type="create" />
            <PvpActionCard type="join" />
          </div>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">⚔️ Jenis Pertarungan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {battleModes.map((mode) => (
                <BattleModeCard key={mode.id} mode={mode} />
              ))}
            </div>
          </section>

          <NonXpInfoBanner />
        </main>
      </div>
    </div>
  )
}
