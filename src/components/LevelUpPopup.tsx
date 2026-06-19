import { motion, AnimatePresence } from "framer-motion"

interface LevelUpPopupProps {
  newLevel: number
  onClose: () => void
}

function ConfettiPiece({ index }: { index: number }) {
  const colors = ["bg-emerald-400", "bg-yellow-400", "bg-blue-400", "bg-pink-400", "bg-purple-400"]
  const color = colors[index % colors.length]
  const left = 10 + (index * 7) % 80
  const delay = index * 0.05

  return (
    <motion.div
      className={`absolute w-2.5 h-2.5 rounded-full ${color}`}
      style={{ left: `${left}%`, top: "-10%" }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, 200, 300],
        x: [0, (index % 3 - 1) * 60],
        rotate: [0, 360, 720],
      }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
    />
  )
}

export default function LevelUpPopup({ newLevel, onClose }: LevelUpPopupProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 p-7 text-center shadow-2xl border border-emerald-400/30 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 40 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}

          <div className="text-6xl mb-3">🎉</div>
          <h2 className="text-2xl font-extrabold text-white">NAIK LEVEL!</h2>
          <p className="text-emerald-100 text-sm mt-1 font-medium">
            Selamat! Kamu sekarang Level {newLevel}
          </p>

          <div className="my-5 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-3xl font-black text-white">{newLevel}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-full bg-white text-emerald-700 font-extrabold text-sm shadow-lg hover:bg-emerald-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Lanjutkan Belajar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
