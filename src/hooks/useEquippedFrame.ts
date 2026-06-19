import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/context/UserContext"

export function useEquippedFrame() {
  const { user } = useUser()
  const [frameConfig, setFrameConfig] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchFrame = async () => {
      const { data: userData } = await supabase
        .from('users')
        .select('equipped_bingkai_id')
        .eq('id', user.id)
        .single()

      if (!userData?.equipped_bingkai_id) {
        setFrameConfig(null)
        return
      }

      const { data: frameItem } = await supabase
        .from('shop_items')
        .select('config')
        .eq('id', userData.equipped_bingkai_id)
        .single()

      setFrameConfig(frameItem?.config || null)
    }

    fetchFrame()
  }, [user])

  return frameConfig
}
