import { motion } from "framer-motion"
import { useSocketPlayer } from "@/hooks/useSocketPlayer"
import { calcLevelXp } from "@/lib/queries"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import { AvatarWithFrame } from "./AvatarWithFrame"
import { useEquippedFrame } from "@/hooks/useEquippedFrame"

export default function Header() {
  const { player, loading } = useSocketPlayer()
  const frameConfig = useEquippedFrame()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  if (loading || !player) {
    return (
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="text-sm text-gray-400">Memuat...</div>
        </div>
      </header>
    )
  }

  const xpCurrent = player.xpCurrent ?? calcLevelXp(player.xp).current
  const xpMax = player.xpMax ?? calcLevelXp(player.xp).max
  const xpPercent = Math.min((xpCurrent / xpMax) * 100, 100)

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-sm font-semibold">
            <span>🔥</span>
            <span>{player.streak}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-sm font-semibold">
            <span>💎</span>
            <span>{player.coins.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">
              LV.{player.level}
            </span>
            <div className="w-24 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="text-[11px] font-medium text-gray-400">
              {xpCurrent}/{xpMax} XP
            </span>
          </div>

          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
            <AvatarWithFrame
              avatarUrl={player.avatarUrl || null}
              initial={player.username.charAt(0).toUpperCase()}
              frameConfig={frameConfig}
              size="sm"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {player.username}
              </p>
              <span className="text-[11px] font-medium text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">
                Level {player.level}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  )
}
