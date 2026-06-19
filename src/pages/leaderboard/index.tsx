import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/context/UserContext"
import { useSocketContext } from "@/context/SocketProvider"
import Sidebar from "@/components/Sidebar"
import { AvatarWithFrame } from "@/components/AvatarWithFrame"

type LeaderboardMode = 'xp' | 'pvp'
type ScopeFilter = 'pondok' | 'regional' | 'nasional'

interface UserProfile {
  id: string
  username: string | null
  full_name: string | null
  school_name: string | null
  regional: string | null
  xp: number
  level: number
  avatar_url: string | null
  equipped_bingkai_id: string | null
}

interface PvpLeaderboardEntry {
  userId: string
  nama: string
  avatarUrl: string | null
  frameConfig: Record<string, any> | null
  totalBattle: number
  totalWins: number
  winRate: number
}

function getLevelTitle(level: number): string {
  if (level >= 1 && level <= 3) return "Santri Baru"
  if (level >= 4 && level <= 6) return "Santri Tekun"
  if (level >= 7 && level <= 9) return "Thalib Ilmi"
  if (level >= 10 && level <= 14) return "Thalib Mahir"
  if (level >= 15 && level <= 19) return "Santri Ahli"
  return "Ustadz Muda"
}

function groupByTier(users: UserProfile[]): Record<string, UserProfile[]> {
  const groups: Record<string, UserProfile[]> = {}
  users.forEach(u => {
    const tier = getLevelTitle(u.level)
    if (!groups[tier]) groups[tier] = []
    groups[tier].push(u)
  })
  return groups
}

const TIER_COLORS: Record<string, string> = {
  "Ustadz Muda": "from-purple-500 to-purple-700",
  "Santri Ahli": "from-amber-500 to-orange-600",
  "Thalib Mahir": "from-emerald-500 to-emerald-600",
  "Thalib Ilmi": "from-blue-500 to-blue-600",
  "Santri Tekun": "from-teal-500 to-teal-600",
  "Santri Baru": "from-gray-400 to-gray-500",
}

const TIER_ICONS: Record<string, string> = {
  "Ustadz Muda": "👑",
  "Santri Ahli": "🏆",
  "Thalib Mahir": "📚",
  "Thalib Ilmi": "📖",
  "Santri Tekun": "🌱",
  "Santri Baru": "🌟",
}

export default function LeaderboardPage() {
  const { user } = useUser()
  const { socket } = useSocketContext()

  const [leaderboardMode, setLeaderboardMode] = useState<LeaderboardMode>('xp')
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('nasional')

  const [xpLeaderboard, setXpLeaderboard] = useState<UserProfile[]>([])
  const [xpLoading, setXpLoading] = useState(true)
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null)

  const [pvpLeaderboard, setPvpLeaderboard] = useState<PvpLeaderboardEntry[]>([])
  const [pvpLoading, setPvpLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('users')
      .select('id, username, full_name, school_name, regional, xp, level, avatar_url, equipped_bingkai_id')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setCurrentUserProfile(data as UserProfile)
      })
  }, [user])

  useEffect(() => {
    if (leaderboardMode !== 'xp') return
    setXpLoading(true)

    const fetchXpLeaderboard = async () => {
      let query = supabase
        .from('users')
        .select('id, username, full_name, school_name, regional, xp, level, avatar_url, equipped_bingkai_id')
        .order('xp', { ascending: false })
        .limit(50)

      if (scopeFilter === 'pondok' && currentUserProfile?.school_name) {
        query = query.eq('school_name', currentUserProfile.school_name)
      }
      if (scopeFilter === 'regional' && currentUserProfile?.regional) {
        query = query.eq('regional', currentUserProfile.regional)
      }

      const { data, error } = await query
      if (error) {
        console.error('[Leaderboard] fetchXpLeaderboard error:', error.message)
        setXpLeaderboard([])
      } else {
        setXpLeaderboard((data || []) as UserProfile[])
      }
      setXpLoading(false)
    }

    fetchXpLeaderboard()
  }, [scopeFilter, currentUserProfile, leaderboardMode])

  useEffect(() => {
    if (!socket || leaderboardMode !== 'pvp') return
    setPvpLoading(true)
    socket.emit('get_pvp_leaderboard')
    socket.on('pvp_leaderboard_result', (data: PvpLeaderboardEntry[]) => {
      setPvpLeaderboard(data)
      setPvpLoading(false)
    })
    return () => { socket.off('pvp_leaderboard_result') }
  }, [socket, leaderboardMode])

  const xpGroups = groupByTier(xpLeaderboard)
  const tierOrder = ["Ustadz Muda", "Santri Ahli", "Thalib Mahir", "Thalib Ilmi", "Santri Tekun", "Santri Baru"]
  const sortedTiers = tierOrder.filter(t => xpGroups[t])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <div className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">

          {/* HERO BANNER */}
          <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <h1 className="text-2xl lg:text-3xl font-bold">🏆 Papan Klasemen</h1>
              <p className="text-white/80 text-sm mt-1 font-medium">
                Peringkat Santri Berdasarkan Penguasaan Ilmu
              </p>
            </div>
          </div>

          {/* SWITCH MODE */}
          <div className="flex gap-2">
            <button
              onClick={() => setLeaderboardMode('xp')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                leaderboardMode === 'xp'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              📚 Leaderboard XP
            </button>
            <button
              onClick={() => setLeaderboardMode('pvp')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                leaderboardMode === 'pvp'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              ⚔️ Leaderboard PvP
            </button>
          </div>

          {/* FILTER SCOPE — ONLY FOR XP MODE */}
          {leaderboardMode === 'xp' && (
            <div className="flex gap-2">
              {(['pondok', 'regional', 'nasional'] as ScopeFilter[]).map((scope) => (
                <button
                  key={scope}
                  onClick={() => setScopeFilter(scope)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    scopeFilter === scope
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {scope === 'pondok' ? 'Satu Pondok' : scope === 'regional' ? 'Regional' : 'Nasional'}
                </button>
              ))}
            </div>
          )}

          {/* XP LEADERBOARD CONTENT */}
          {leaderboardMode === 'xp' && (
            <>
              {xpLoading ? (
                <div className="text-center py-12 text-gray-400">Memuat leaderboard...</div>
              ) : xpLeaderboard.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Belum ada data santri.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedTiers.map((tier) => {
                    const users = xpGroups[tier]
                    return (
                      <div key={tier}>
                        {/* TIER HEADER */}
                        <div className={`bg-gradient-to-r ${TIER_COLORS[tier] || 'from-gray-500 to-gray-600'} rounded-2xl px-5 py-3 mb-3 flex items-center gap-3`}>
                          <span className="text-xl">{TIER_ICONS[tier] || '📌'}</span>
                          <div>
                            <h3 className="text-white font-bold text-sm">{tier}</h3>
                            <p className="text-white/70 text-[11px]">{users.length} santri</p>
                          </div>
                        </div>

                        {/* USERS IN TIER */}
                        <div className="space-y-2">
                          {users.map((entry, idx) => {
                            const isMe = user && entry.id === user.id
                            return (
                              <div
                                key={entry.id}
                                className={`bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border ${
                                  isMe ? 'border-emerald-300 bg-emerald-50' : 'border-gray-100'
                                }`}
                              >
                                <span className="w-6 text-center text-sm font-bold text-gray-400">
                                  {idx + 1}
                                </span>
                                <AvatarWithFrame
                                  avatarUrl={entry.avatar_url}
                                  initial={(entry.full_name || entry.username || "?").slice(0, 2).toUpperCase()}
                                  frameConfig={null}
                                  size="sm"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-800 text-sm truncate">
                                      {entry.full_name || entry.username || "Santri"}
                                    </p>
                                    {isMe && (
                                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                        KAMU
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                    <span>LV.{entry.level}</span>
                                    {entry.school_name && (
                                      <>
                                        <span>•</span>
                                        <span className="truncate">{entry.school_name}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-emerald-600 text-sm">
                                    {entry.xp.toLocaleString()} XP
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* PVP LEADERBOARD CONTENT */}
          {leaderboardMode === 'pvp' && (
            <>
              {pvpLoading ? (
                <div className="text-center py-12 text-gray-400">Memuat leaderboard PvP...</div>
              ) : pvpLeaderboard.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Belum ada data battle PvP.</p>
                  <p className="text-sm mt-1">Mulai battle untuk masuk klasemen!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pvpLeaderboard.map((entry, idx) => (
                    <div
                      key={entry.userId}
                      className={`bg-white rounded-2xl p-4 flex items-center gap-4 border ${
                        entry.userId === user?.id
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-gray-100'
                      }`}
                    >
                      <div className="w-8 text-center shrink-0">
                        {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' :
                          <span className="text-gray-400 font-bold">#{idx + 1}</span>}
                      </div>
                      <AvatarWithFrame
                        avatarUrl={entry.avatarUrl}
                        initial={entry.nama.slice(0, 2).toUpperCase()}
                        frameConfig={entry.frameConfig}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-800 truncate">{entry.nama}</p>
                          {entry.userId === user?.id && (
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                              KAMU
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {entry.totalWins} menang dari {entry.totalBattle} battle
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-orange-500 text-lg">{entry.winRate}%</p>
                        <p className="text-[11px] text-gray-400">Win Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}
