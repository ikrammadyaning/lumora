import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { tipsHarian } from "@/data/dummyData"
import { useUser } from "@/context/UserContext"
import { useQuestCount } from "@/hooks/useQuestCount"

const menuItems = [
  { label: "Beranda", icon: "🏠", to: "/beranda" },
  { label: "Jalur Belajar", icon: "📚", to: "/jalur-belajar" },
  { label: "Side Quest", icon: "⚡", to: "/side-quest" },
  { label: "PvP Battle", icon: "⚔️", to: "/pvp-battle" },
  { label: "Leaderboard", icon: "🏆", to: "/leaderboard" },
  { label: "Toko Item", icon: "🛒", to: "/toko-item" },
  { label: "Profil", icon: "👤", to: "/profil" },
]

export default function Sidebar() {
  const location = useLocation()
  const { user } = useUser()
  const questCount = useQuestCount(user?.id || "")
  const [randomTip, setRandomTip] = useState("")

  useEffect(() => {
    setRandomTip(tipsHarian[Math.floor(Math.random() * tipsHarian.length)])
  }, [])

  const isActive = (to: string) => {
    if (to === "#") return false
    return location.pathname === to || location.pathname.startsWith(to + "/")
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] flex-col z-40"
        style={{ backgroundColor: "var(--sidebar-bg)" }}
      >
        <div className="px-6 pt-8 pb-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            RuangSantri
          </h1>
          <p className="text-emerald-400/70 text-sm mt-0.5 font-medium">
            Platform Ilmu Islam
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.to)
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>

              {item.label === "Side Quest" && questCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {questCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-wider mb-1.5">
              💡 Tip Hari Ini
            </p>

            <p className="text-white/70 text-xs leading-relaxed italic">
              {randomTip}
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 z-40 px-2 pb-safe"
        style={{ backgroundColor: "var(--sidebar-bg)" }}
      >
        <div className="flex items-center justify-around py-2">
          {menuItems.slice(0, 5).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
                isActive(item.to)
                  ? "text-emerald-400"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <span className="text-lg">{item.icon}</span>

              <span className="text-[10px]">{item.label}</span>

              {item.label === "Side Quest" && questCount > 0 && (
                <span className="absolute -top-0.5 right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {questCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}