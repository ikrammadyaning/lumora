import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export interface Quest {
  id: string
  title: string
  description: string
  mapel: string
  tingkat: "Mudah" | "Menengah" | "Sulit"
  icon: string
  icon_bg: string
  xp_reward: number
  koin_reward: number
  deadline_days: number
  is_active: boolean
  created_at: string
}

export function useQuestList(userId: string) {
  const [quests, setQuests] = useState<Quest[]>([])
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const fetchQuests = useCallback(async () => {
    const { data } = await supabase
      .from("quests")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
    setQuests(data || [])
  }, [])

  const fetchSubmissions = useCallback(async () => {
    if (!userId) {
      setSubmittedIds(new Set())
      return
    }
    const { data } = await supabase
      .from("quest_submissions")
      .select("quest_id")
      .eq("user_id", userId)
    setSubmittedIds(new Set(data?.map((d) => d.quest_id)))
  }, [userId])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchQuests(), fetchSubmissions()]).finally(() => setLoading(false))

    fetchQuests()
    fetchSubmissions()

    if (!userId) return
    const channel = supabase
      .channel("quest-list")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "quest_submissions",
        filter: `user_id=eq.${userId}`,
      }, () => {
        fetchSubmissions()
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "quests",
        filter: "is_active=eq.true",
      }, () => {
        fetchQuests()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, fetchQuests, fetchSubmissions])

  return { quests, submittedIds, loading, refetchSubmissions: fetchSubmissions }
}
