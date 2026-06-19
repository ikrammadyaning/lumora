import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface QuestSuccessPopupProps {
  show: boolean
  xpGained: number
  koinGained: number
  onComplete: () => void
}

export default function QuestSuccessPopup({ show, xpGained, koinGained, onComplete }: QuestSuccessPopupProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            </motion.div>

            <h3 className="text-xl font-bold text-gray-800 mb-1">
              Quest Selesai! 🎉
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Jawabanmu telah tercatat
            </p>

            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">+{xpGained}</p>
                <p className="text-xs text-gray-400 font-medium">XP</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">+{koinGained}</p>
                <p className="text-xs text-gray-400 font-medium">Koin</p>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full h-12 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98]" style={{ backgroundColor: 'var(--accent-color)' }}
            >
              Lanjut
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
