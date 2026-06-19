import { motion } from "framer-motion"

interface QuestBannerProps {
  availableCount: number
  completedCount: number
}

export default function QuestBanner({ availableCount, completedCount }: QuestBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-purple-700 p-6 lg:p-8"
    >
      <div className="relative z-10">
        <span className="inline-block text-[11px] font-bold text-yellow-300 bg-yellow-300/20 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
          ⚡ OPSIONAL TAPI MENGGIURKAN!
        </span>
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">
          Murojaah Esai
        </h2>
        <p className="text-white/70 text-sm lg:text-base max-w-md">
          Tulis esai, raih XP + Koin bonus 🪙
        </p>

        <div className="flex items-center gap-6 mt-6">
          <div>
            <p className="text-2xl font-bold text-white">{availableCount}</p>
            <p className="text-white/60 text-xs font-medium">Quest Tersedia</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <p className="text-2xl font-bold text-white">{completedCount}</p>
            <p className="text-white/60 text-xs font-medium">Selesai</p>
          </div>
        </div>
      </div>

      <span className="absolute right-4 bottom-2 text-7xl lg:text-8xl opacity-20 select-none">
        ✍️
      </span>
    </motion.div>
  )
}
