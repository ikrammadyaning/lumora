import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSocketContext } from "@/context/SocketProvider"
import { useUser } from "@/context/UserContext"
import { AvatarWithFrame } from "@/components/AvatarWithFrame"

interface PvpLeaderboardEntry {
  userId: string
  nama: string
  avatarUrl: string | null
  frameConfig: Record<string, any> | null
  totalBattle: number
  totalWins: number
  winRate: number
}

export default function PvpLeaderboardMini() {
  const navigate = useNavigate()
  const { socket } = useSocketContext()
  const { user } = useUser()
  const [leaderboard, setLeaderboard] = useState<PvpLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!socket) return
    socket.emit('get_pvp_leaderboard')
    socket.on('pvp_leaderboard_result', (data: PvpLeaderboardEntry[]) => {
      setLeaderboard(data)
      setLoading(false)
    })
    return () => { socket.off('pvp_leaderboard_result') }
  }, [socket])

  return (
    <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2 text-gray-800">
          ⚔️ Leaderboard PvP
        </h3>
        <button 
          onClick={() => navigate('/pvp-battle')}
          className="text-emerald-500 text-sm font-medium"
        >
          Lihat Semua →
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Memuat...</p>
      ) : leaderboard.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada data battle PvP.</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((entry, idx) => (
            <div 
              key={entry.userId}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                entry.userId === user?.id ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="w-6 text-center">
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : 
                  <span className="text-gray-400 text-sm">#{idx + 1}</span>}
              </div>
              <AvatarWithFrame
                avatarUrl={entry.avatarUrl}
                initial={entry.nama.charAt(0).toUpperCase()}
                frameConfig={entry.frameConfig}
                size="sm"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">
                  {entry.nama}{entry.userId === user?.id && (
                    <span className="text-emerald-500 text-xs ml-1">(Kamu)</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">
                  {entry.totalWins} menang dari {entry.totalBattle} battle
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-500 text-sm">{entry.winRate}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
