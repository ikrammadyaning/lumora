import { motion } from "framer-motion"
import { Plus, Bot } from "lucide-react"
import { AvatarWithFrame } from "../AvatarWithFrame"

export interface PlayerData {
  userId: string
  nama: string
  asalSekolah: string
  avatarUrl: string | null
  frameConfig: Record<string, any> | null
  isReady: boolean
  isBot: boolean
  score: number
  isMe: boolean
}

interface PlayerSlotItemProps {
  player?: PlayerData
  empty?: boolean
  slotNumber: number
}

function getInitials(nama: string): string {
  return nama
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function PlayerSlotItem({ player, empty, slotNumber }: PlayerSlotItemProps) {
  if (empty || !player) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: slotNumber * 0.05 }}
        className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gray-50/50 border border-dashed border-gray-200"
      >
        <span className="w-6 text-center text-sm font-medium text-gray-300 shrink-0">
          {slotNumber}
        </span>
        <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
          <Plus className="w-4 h-4 text-gray-300" />
        </div>
        <p className="text-sm text-gray-300 italic">Menunggu pemain...</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: (slotNumber - 1) * 0.05 }}
      className={`flex items-center gap-3 py-3 px-4 rounded-xl ${
        player.isMe ? "bg-blue-50/70 border border-blue-100" : "bg-white border border-gray-100"
      }`}
    >
      <span className="w-6 text-center text-sm font-medium text-gray-400 shrink-0">
        {slotNumber}
      </span>
      <div className="relative shrink-0">
        <AvatarWithFrame
          avatarUrl={player.avatarUrl}
          initial={getInitials(player.nama)}
          frameConfig={player.frameConfig}
          size="md"
        />
        {player.isBot && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white">
            <Bot className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-bold text-gray-800 truncate">
            {player.nama}
          </p>
          {player.isMe && (
            <span className="text-[10px] font-semibold bg-blue-500 text-white px-1.5 py-0.5 rounded shrink-0">
              Kamu
            </span>
          )}
          {player.isBot && (
            <span className="text-[10px] font-semibold bg-gray-600 text-white px-1.5 py-0.5 rounded shrink-0">
              BOT
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 truncate">{player.asalSekolah}</p>
      </div>
      <div className="shrink-0">
        {player.isReady ? (
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
            ✓ SIAP
          </span>
        ) : (
          <span className="text-xs font-semibold bg-gray-100 text-gray-400 px-2.5 py-1 rounded-lg">
            Menunggu
          </span>
        )}
      </div>
    </motion.div>
  )
}
