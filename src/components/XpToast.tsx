import { motion, AnimatePresence } from "framer-motion"

interface XpToastProps {
  xpGained: number
  onComplete: () => void
}

export default function XpToast({ xpGained, onComplete }: XpToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: "spring", damping: 20, stiffness: 260 }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 2000)
        }}
      >
        <div className="bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="text-2xl">🌟</span>
          <div>
            <p className="font-bold text-sm">+{xpGained} XP!</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
