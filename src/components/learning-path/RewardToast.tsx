import { motion, AnimatePresence } from "framer-motion"
import { Star, Gem } from "lucide-react"

interface RewardToastProps {
  show: boolean
  xpGained?: number
  coinGained?: number
  onComplete: () => void
}

export default function RewardToast({
  show,
  xpGained = 50,
  coinGained = 50,
  onComplete,
}: RewardToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="rounded-2xl shadow-2xl border border-gray-100 p-6 text-center max-w-xs w-full pointer-events-auto" style={{ backgroundColor: 'var(--card-bg)' }}
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
            onAnimationComplete={() => {
              setTimeout(onComplete, 2500)
            }}
          >
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-gray-800 font-bold text-sm mb-3">
              Kamu mendapatkan reward!
            </p>

            <div className="flex items-center justify-center gap-5">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-bold">
                <Star className="w-4 h-4" fill="#10b981" />
                <span>+{xpGained} XP</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-bold">
                <Gem className="w-4 h-4" fill="#f59e0b" />
                <span>+{coinGained} Diamond</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
