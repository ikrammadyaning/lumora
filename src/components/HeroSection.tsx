import { motion } from "framer-motion"
import { motivationalQuotes } from "@/data/dummyData"
import { useState, useEffect } from "react"
import { useSocketPlayer } from "@/hooks/useSocketPlayer"

export default function HeroSection() {
  const { player } = useSocketPlayer()
  const [quote, setQuote] = useState("")

  useEffect(() => {
    setQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    )
  }, [])

  if (!player) return null

  const statItems = [
    { icon: "🔥", label: "Streak", value: player.streak, unit: "hari" },
    { icon: "⭐", label: "Total XP", value: player.xp.toLocaleString(), unit: "pts" },
    { icon: "🪙", label: "Koin", value: player.coins.toLocaleString(), unit: "koin" },
  ]

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2e2a] via-[#1f3630] to-emerald-900 p-6 lg:p-10">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-400/5 rounded-full blur-2xl" />

      <div className="relative z-10">
        <motion.h1
          className="text-2xl lg:text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Assalamu&apos;alaikum, {player.username} 👋
        </motion.h1>
        <motion.p
          className="text-emerald-200/80 mt-1.5 text-sm lg:text-base max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {quote}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {statItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10"
            >
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="text-white font-bold text-lg leading-tight">
                  {item.value}
                </p>
                <p className="text-emerald-200/60 text-[11px] font-medium">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
