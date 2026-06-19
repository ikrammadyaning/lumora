import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/context/UserContext"
import { motion, AnimatePresence } from "framer-motion"

export function EquippedEffect() {
  const { user } = useUser()
  const [effectConfig, setEffectConfig] = useState<Record<string, any> | null>(null)
  const [particles, setParticles] = useState<number[]>([])

  useEffect(() => {
    if (!user) return

    const fetchEffect = async () => {
      const { data: userData } = await supabase
        .from('users')
        .select('equipped_efek_id')
        .eq('id', user.id)
        .single()

      if (!userData?.equipped_efek_id) {
        setEffectConfig(null)
        return
      }

      const { data: effectItem } = await supabase
        .from('shop_items')
        .select('config')
        .eq('id', userData.equipped_efek_id)
        .single()

      setEffectConfig(effectItem?.config || null)
    }
    fetchEffect()
  }, [user])

  useEffect(() => {
    if (!effectConfig) return
    const interval = setInterval(() => {
      setParticles(prev => [...prev, Date.now()])
      setTimeout(() => {
        setParticles(prev => prev.slice(1))
      }, 2000)
    }, 1500)
    return () => clearInterval(interval)
  }, [effectConfig])

  if (!effectConfig) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {particles.map((id) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: Math.random() * window.innerWidth, y: -20 }}
            animate={{ opacity: [0, 1, 0], y: window.innerHeight + 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeIn" }}
            className="absolute text-2xl"
            style={{ color: effectConfig.particleColor }}
          >
            {effectConfig.animationType === 'falling-stars' ? '⭐' : '✨'}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
