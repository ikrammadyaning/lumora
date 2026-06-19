import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useQuestCount(userId: string) {
  const [availableCount, setAvailableCount] = useState(0)

  const fetchCount = async () => {
    if (!userId) {
      setAvailableCount(0)
      return
    }
    const { data: quests } = await supabase
      .from("quests")
      .select("id")
      .eq("is_active", true)
    const { data: done } = await supabase
      .from("quest_submissions")
      .select("quest_id")
      .eq("user_id", userId)

    const doneIds = new Set(done?.map((d) => d.quest_id))
    const remaining = quests?.filter((q) => !doneIds.has(q.id)).length || 0
    setAvailableCount(remaining)
  }

  useEffect(() => {
    fetchCount()
    if (!userId) return
    const channel = supabase
      .channel("quest-count")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "quest_submissions",
        filter: `user_id=eq.${userId}`,
      }, fetchCount)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return availableCount
}
