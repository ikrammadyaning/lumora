import { motion, AnimatePresence } from "framer-motion"

interface StreakPopupProps {
  isOpen: boolean
  streakCount: number
  nextTarget: number
  onClose: () => void
}

export default function StreakPopup({
  isOpen,
  streakCount,
  nextTarget,
  onClose,
}: StreakPopupProps) {
  const fireIcons = Math.min(streakCount, 7)
  const extra = streakCount > 7 ? streakCount - 7 : 0

  const messages = [
    "Kamu sudah belajar 1 hari berturut-turut. Ayo lanjutkan!",
    "Hari ke-2! Pertahankan semangatmu!",
    "3 hari berturut-turut! Luar biasa!",
    "4 hari! Konsistensi adalah kunci!",
    "5 hari! Kamu sedang membangun kebiasaan hebat!",
    "6 hari! Hampir satu minggu penuh!",
    "7 hari! Satu minggu penuh! Hebat!",
  ]

  const message =
    streakCount <= 7
      ? messages[streakCount - 1]
      : `Kamu sudah belajar ${streakCount} hari berturut-turut. Jangan berhenti!`

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-orange-500 via-orange-600 to-red-600 p-7 text-center shadow-2xl border border-orange-400/30"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:bg-black/30 hover:text-white transition-colors text-sm"
            >
              ✕
            </button>

            <div className="text-6xl mb-3 animate-bounce">🔥</div>

            <h2 className="text-2xl font-extrabold text-white">
              {streakCount} Hari Berturut-turut!
            </h2>
            <p className="text-orange-100 text-sm mt-1 font-medium">
              Terus pertahankan semangatmu!
            </p>

            <div className="flex items-center justify-center gap-1.5 my-4">
              {Array.from({ length: fireIcons }).map((_, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, type: "spring" }}
                >
                  🔥
                </motion.span>
              ))}
              {extra > 0 && (
                <span className="text-white font-bold text-sm ml-1">
                  +{extra}
                </span>
              )}
            </div>

            <div className="bg-black/20 rounded-2xl p-4 mb-3 backdrop-blur-sm">
              <p className="text-white/90 text-sm leading-relaxed">{message}</p>
            </div>

            <p className="text-orange-100 text-sm font-semibold mb-4">
              🎯 Target berikutnya:{" "}
              <span className="text-white">{nextTarget} hari</span> streak
            </p>

            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-full bg-white text-orange-600 font-extrabold text-sm shadow-lg hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              SEMANGAT TERUS! 💪
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
