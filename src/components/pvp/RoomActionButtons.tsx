import { motion } from "framer-motion"
import { Check, Swords, RotateCcw, Clock } from "lucide-react"

interface RoomActionButtonsProps {
  isReady: boolean
  isHost: boolean
  canStartBattle: boolean
  isRoomLobby: boolean
  onToggleReady: () => void
  onMulaiBattle: () => void
}

export default function RoomActionButtons({
  isReady,
  isHost,
  canStartBattle,
  isRoomLobby,
  onToggleReady,
  onMulaiBattle,
}: RoomActionButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 lg:left-[260px] right-0 z-30 bg-white border-t border-gray-100 px-4 lg:px-8 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-xl mx-auto flex gap-3">
        <motion.button
          layout
          onClick={onToggleReady}
          disabled={!isRoomLobby}
          className={`flex-1 h-14 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] ${
            !isRoomLobby
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : isReady
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200"
          }`}
        >
          {isReady ? (
            <>
              <RotateCcw className="w-4 h-4" />
              Batalkan Siap
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Siap Bertarung!
            </>
          )}
        </motion.button>

        {isHost ? (
          <motion.button
            layout
            onClick={onMulaiBattle}
            disabled={!canStartBattle}
            className={`flex-[1.5] h-14 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              canStartBattle
                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-white/40 cursor-not-allowed"
            }`}
          >
            <Swords className="w-4 h-4" />
            Mulai Battle!
          </motion.button>
        ) : (
          <motion.div
            layout
            className="flex-[1.5] h-14 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gray-100 text-gray-400"
          >
            <Clock className="w-4 h-4" />
            Menunggu host memulai battle...
          </motion.div>
        )}
      </div>
    </div>
  )
}
