import { useState, useEffect } from "react"
import { Trophy, Swords, Gem } from "lucide-react"
import { useSocketContext } from "@/context/SocketProvider"
import { useUser } from "@/context/UserContext"

export default function PvPHeroBanner() {
  const { user } = useUser()
  const { socket } = useSocketContext()

  const [pvpStats, setPvpStats] = useState({
    winRate: 0,
    totalBattle: 0,
    bestRank: null as number | null,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!user || !socket) return

    setStatsLoading(true)
    socket.emit("get_pvp_stats", { userId: user.id })

    socket.on("pvp_stats_result", (stats: { winRate: number; totalBattle: number; bestRank: number | null }) => {
      setPvpStats(stats)
      setStatsLoading(false)
    })

    return () => {
      socket.off("pvp_stats_result")
    }
  }, [user, socket])

  return (
    <div className="relative bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl p-6 lg:p-8 overflow-hidden">
      <div className="absolute right-0 top-0 text-white/5 pointer-events-none">
        <Swords className="w-48 h-48 -mr-8 -mt-8" />
      </div>

      <div className="relative z-10">
        <span className="inline-block text-white/70 text-xs font-semibold tracking-wider mb-2">
          ⚔️ ARENA PERTARUNGAN
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">PvP Battle</h1>
        <p className="text-white/60 text-sm mb-6">Bertarung ilmu dengan santri lainnya!</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-800/40 backdrop-blur-sm rounded-xl p-4 text-center">
            <Trophy className="w-5 h-5 text-yellow-300 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">
              {statsLoading ? "..." : `${pvpStats.winRate}%`}
            </p>
            <p className="text-[11px] text-white/60 font-medium uppercase tracking-wide">WIN RATE</p>
          </div>
          <div className="bg-red-800/40 backdrop-blur-sm rounded-xl p-4 text-center">
            <Swords className="w-5 h-5 text-orange-300 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">
              {statsLoading ? "..." : pvpStats.totalBattle}
            </p>
            <p className="text-[11px] text-white/60 font-medium uppercase tracking-wide">TOTAL BATTLE</p>
          </div>
          <div className="bg-red-800/40 backdrop-blur-sm rounded-xl p-4 text-center">
            <Gem className="w-5 h-5 text-purple-300 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">
              {statsLoading ? "..." : pvpStats.bestRank ? `#${pvpStats.bestRank}` : "-"}
            </p>
            <p className="text-[11px] text-white/60 font-medium uppercase tracking-wide">BEST RANK</p>
          </div>
        </div>
      </div>
    </div>
  )
}