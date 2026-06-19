import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { useSocketContext } from "@/context/SocketProvider"
import { useUser } from "@/context/UserContext"
import { AvatarWithFrame } from "@/components/AvatarWithFrame"

interface LeaderboardEntry {
  userId: string
  nama: string
  avatarUrl: string | null
  frameConfig: Record<string, any> | null
  totalBattle: number
  totalWins: number
  winRate: number
}

export default function PvpLeaderboardPage() {
  const navigate = useNavigate()
  const { socket } = useSocketContext()
  const { user } = useUser()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!socket) return
    socket.emit('get_pvp_leaderboard')
    socket.on('pvp_leaderboard_result', (data: LeaderboardEntry[]) => {
      setLeaderboard(data)
      setLoading(false)
    })
    return () => { socket.off('pvp_leaderboard_result') }
  }, [socket])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="lg:ml-[260px] p-6">
        <button onClick={() => navigate('/pvp-battle')} className="mb-4 text-gray-500 hover:text-gray-700 transition-colors">
          ← Kembali
        </button>
        <h1 className="text-xl font-bold mb-1">Leaderboard PvP Battle</h1>
        <p className="text-gray-400 text-sm mb-6">Ranking santri terbaik dalam pertarungan ilmu</p>

        {loading ? (
          <p className="text-gray-400">Memuat leaderboard...</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-gray-400">Belum ada data battle.</p>
        ) : (
          <div className="rounded-2xl border border-gray-100 divide-y" style={{ backgroundColor: 'var(--card-bg)' }}>
            {leaderboard.map((entry, idx) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 p-4 ${entry.userId === user?.id ? 'bg-emerald-50' : ''}`}
              >
                <div className="w-8 text-center font-bold text-gray-400">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                </div>
                <AvatarWithFrame
                  avatarUrl={entry.avatarUrl}
                  initial={entry.nama.charAt(0).toUpperCase()}
                  frameConfig={entry.frameConfig}
                  size="md"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {entry.nama} {entry.userId === user?.id && <span className="text-emerald-500">(Kamu)</span>}
                  </p>
                  <p className="text-xs text-gray-400">{entry.totalBattle} battle • {entry.totalWins} menang</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">{entry.winRate}%</p>
                  <p className="text-xs text-gray-400">Win Rate</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}