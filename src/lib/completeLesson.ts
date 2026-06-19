import { supabase } from './supabase'
import { giveReward, RewardResult } from './rewardHandler'

export interface CompleteLessonResult extends RewardResult {
  alreadyCompleted: boolean
}

export async function completeLesson(
  userId: string,
  lessonId: string,
  xpReward: number,
  coinsReward: number
): Promise<CompleteLessonResult> {
  const { data: existing, error: checkError } = await supabase
    .from('lesson_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  if (checkError) {
    console.error('[completeLesson] Gagal cek progress:', checkError.message)
  }

  if (existing) {
    return {
      success: false, newXp: 0, newCoins: 0,
      newLevel: 1, leveledUp: false, alreadyCompleted: true,
      error: 'Sudah pernah diselesaikan'
    }
  }

  const { error: insertError } = await supabase
    .from('lesson_progress')
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString()
    })

  if (insertError) {
    console.error('[completeLesson] Gagal simpan progress:', insertError.message)
    return {
      success: false, newXp: 0, newCoins: 0,
      newLevel: 1, leveledUp: false, alreadyCompleted: false,
      error: insertError.message
    }
  }

  const rewardResult = await giveReward(userId, xpReward, coinsReward)

  return { ...rewardResult, alreadyCompleted: false }
}
