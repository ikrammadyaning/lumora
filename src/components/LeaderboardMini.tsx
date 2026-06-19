import { useSocketPlayer } from "@/hooks/useSocketPlayer"
import { useUser } from "@/context/UserContext"
import { AvatarWithFrame } from "./AvatarWithFrame"

const rankBadges = ["🥇", "🥈", "🥉"]

export default function LeaderboardMini() {
  const { user: authUser } = useUser()
  const { leaderboard, loading } = useSocketPlayer()

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: 'var(--card-bg)' }}>
        <p className="text-sm text-gray-400">Memuat leaderboard...</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">🏆 Leaderboard</h3>
        <a
          href="/leaderboard"
          className="text-xs font-semibold text-emerald-500 hover:text-emerald-600"
        >
          Lihat Semua →
        </a>
      </div>

      <div className="space-y-2.5">
        {leaderboard.slice(0, 5).map((entry, index) => {
          const isMe = authUser && entry.id === authUser.id
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isMe
                  ? "bg-emerald-50 border border-emerald-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="w-7 text-center text-lg">
                {rankBadges[index] || `#${index + 1}`}
              </span>
              <AvatarWithFrame
                avatarUrl={(entry as any).avatarUrl || null}
                initial={(entry.full_name || entry.username || "?").charAt(0).toUpperCase()}
                frameConfig={(entry as any).frameConfig || null}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {entry.full_name || entry.username || "Santri"}
                  {isMe && (
                    <span className="text-[10px] text-emerald-500 ml-1 font-medium">
                      (Kamu)
                    </span>
                  )}
                </p>
                <span className="text-[10px] text-gray-400">LV.{entry.level}</span>
              </div>
              <span className="text-xs font-bold text-emerald-600">
                {entry.xp.toLocaleString()} XP
              </span>
            </div>
          )
        })}

        {leaderboard.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            Belum ada data leaderboard.
          </p>
        )}
      </div>
    </div>
  )
}
