import { useState, useEffect } from "react"
import { AvatarWithFrame } from "../AvatarWithFrame"

interface MiniScoreboardPlayer {
  userId: string
  nama: string
  score: number
  team: string
  isBot: boolean
  avatarUrl?: string | null
  frameConfig?: Record<string, any> | null
}

interface MiniScoreboardProps {
  players: MiniScoreboardPlayer[]
  currentUserId: string
}

export default function MiniScoreboard({ players, currentUserId }: MiniScoreboardProps) {
  const currentPlayer = players.find(p => p.userId === currentUserId)
  const teammates = players.filter(p => p.userId !== currentUserId && p.team === currentPlayer?.team)
  const opponents = players.filter(p => p.team !== currentPlayer?.team)
  const [opponentIndex, setOpponentIndex] = useState(0)

  useEffect(() => {
    if (opponents.length <= 1) return
    const interval = setInterval(() => {
      setOpponentIndex(prev => (prev + 1) % opponents.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [opponents.length])

  const currentOpponent = opponents[opponentIndex] || opponents[0]

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:pl-[260px] z-50">
      <div className="bg-gray-900/95 backdrop-blur border-t border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Current player (left) */}
          <div className="flex items-center gap-2">
            <AvatarWithFrame
              avatarUrl={currentPlayer?.avatarUrl || null}
              initial={currentPlayer?.nama?.charAt(0).toUpperCase() || "?"}
              frameConfig={currentPlayer?.frameConfig || null}
              size="sm"
            />
            <div>
              <p className="text-xs text-gray-400 font-medium">Kamu</p>
              <p className="text-white font-bold text-sm">{currentPlayer?.score || 0}</p>
            </div>
          </div>

          {/* VS divider */}
          <div className="text-red-400 font-bold text-xs">⚔️ VS</div>

          {/* Opponent (right, cycling) */}
          {currentOpponent && (
            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="text-xs text-gray-400 font-medium truncate max-w-[80px]">
                  {currentOpponent.nama}
                  {currentOpponent.isBot && " 🤖"}
                </p>
                <p className="text-white font-bold text-sm">{currentOpponent.score}</p>
              </div>
              <AvatarWithFrame
                avatarUrl={currentOpponent?.avatarUrl || null}
                initial={currentOpponent?.nama?.charAt(0).toUpperCase() || "?"}
                frameConfig={currentOpponent?.frameConfig || null}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
