import { supabase } from "./supabase"

export interface Course {
  id: string
  name: string
  icon: string
  color: string
  kitab: string | null
  ustadz: string | null
  order: number
}

export function calcLevelXp(xp: number): { current: number; max: number } {
  return { current: xp % 100, max: 100 }
}

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("order", { ascending: true })
  if (error) {
    console.error("getCourses error:", error)
    return []
  }
  return data || []
}

export async function ensureUserProfile(
  userId: string,
  meta?: { username?: string; full_name?: string; email?: string }
): Promise<void> {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle()

  if (!existing) {
    await supabase.from("users").insert({
      id: userId,
      email: meta?.email || null,
      username: meta?.username || meta?.full_name || "Santri",
      full_name: meta?.full_name || null,
      xp: 0,
      level: 1,
      coins: 0,
      streak: 0,
    })
  }
}
