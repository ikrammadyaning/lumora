import { motion } from "framer-motion"
import { Users } from "lucide-react"
import PlayerSlotItem from "./PlayerSlotItem"
import type { PlayerData } from "./PlayerSlotItem"

interface PlayerSlotListProps {
  players: PlayerData[]
  totalSlots?: number
}

export default function PlayerSlotList({ players, totalSlots = 5 }: PlayerSlotListProps) {
  const slots = Array.from({ length: totalSlots }, (_, i) => i + 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-2xl shadow-sm p-6 lg:p-8" style={{ backgroundColor: 'var(--card-bg)' }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Users className="w-5 h-5 text-gray-500" />
        <h2 className="text-base font-bold text-gray-900">
          Pemain ({players.length}/{totalSlots})
        </h2>
      </div>

      <div className="space-y-2">
        {slots.map((slotNumber) => {
          const player = players[slotNumber - 1]
          return (
            <PlayerSlotItem
              key={slotNumber}
              player={player}
              empty={!player}
              slotNumber={slotNumber}
            />
          )
        })}
      </div>
    </motion.div>
  )
}
