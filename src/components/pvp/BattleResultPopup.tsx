import { motion } from "framer-motion"
import { Trophy, XCircle, CheckCircle, ArrowLeft, Coins } from "lucide-react"

interface AnsweredLog {
  questionText: string
  isCorrect: boolean
}

interface BattleResultPopupProps {
  isWinner: boolean
  teamScore: number
  opponentScore: number
  totalCorrect: number
  totalQuestions: number
  answeredLog: AnsweredLog[]
  coinsEarned: number
  onBackToArena: () => void
}

export default function BattleResultPopup({
  isWinner, teamScore, opponentScore, totalCorrect, totalQuestions,
  answeredLog, coinsEarned, onBackToArena
}: BattleResultPopupProps) {
  const bgGradient = isWinner
    ? "bg-gradient-to-b from-yellow-400 via-orange-400 to-yellow-500"
    : "bg-gradient-to-b from-gray-500 via-gray-600 to-gray-700"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${bgGradient}`}
      >
        <div className="p-6 text-center text-white">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-3"
          >
            {isWinner ? "🏆" : "😔"}
          </motion.div>

          <h1 className="text-3xl font-black mb-1">
            {isWinner ? "MENANG!" : "KALAH"}
          </h1>
          <p className="text-sm text-white/80">
            {isWinner
              ? "Alhamdulillah, timmu luar biasa! 🎉"
              : "Jangan menyerah, masih ada kesempatan lain! 💪"}
          </p>

          <div className="mt-5 bg-white/15 rounded-2xl p-4 backdrop-blur">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-white/70">Skor Tim Kamu</p>
                <p className="text-2xl font-black">{teamScore}</p>
              </div>
              <span className="text-lg font-bold text-white/50">VS</span>
              <div className="text-right">
                <p className="text-xs text-white/70">Skor Tim Lawan</p>
                <p className="text-2xl font-black">{opponentScore}</p>
              </div>
            </div>
          </div>

          {isWinner && coinsEarned > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 bg-yellow-300/30 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2"
            >
              <Coins className="w-5 h-5 text-yellow-300" />
              <span className="font-bold text-yellow-200">+{coinsEarned} Koin diberikan!</span>
            </motion.div>
          )}

          <div className="mt-4 bg-white/10 rounded-2xl p-4">
            <p className="text-sm font-semibold mb-2">
              Ringkasan Jawaban ({totalCorrect}/{totalQuestions} benar)
            </p>
            <div className="max-h-40 overflow-y-auto space-y-1.5 text-left">
              {answeredLog.map((log, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {log.isCorrect
                    ? <CheckCircle className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
                  }
                  <span className="text-white/80">{log.questionText}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onBackToArena}
            className="mt-5 w-full bg-white/20 hover:bg-white/30 active:scale-[0.98] rounded-xl py-3.5 font-bold text-white flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Arena
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
