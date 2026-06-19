import { supabase } from './supabase'

export interface RewardResult {
  success: boolean
  newXp: number
  newCoins: number
  newLevel: number
  leveledUp: boolean
  error?: string
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 1500, 2250, 3250, 4500, 6000]

function calculateLevel(totalXp: number): number {
  let level = 1
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
    }
  }
  return level
}

export async function giveReward(
  userId: string,
  xpGained: number,
  coinsGained: number
): Promise<RewardResult> {
  if (!userId) {
    return {
      success: false, newXp: 0, newCoins: 0,
      newLevel: 1, leveledUp: false, error: 'userId kosong'
    }
  }

  const { data: currentUser, error: fetchError } = await supabase
    .from('users')
    .select('xp, coins, level')
    .eq('id', userId)
    .maybeSingle()

  if (fetchError) {
    console.error('[giveReward] Gagal fetch user:', fetchError.message)
    return {
      success: false, newXp: 0, newCoins: 0,
      newLevel: 1, leveledUp: false, error: fetchError.message
    }
  }

  if (!currentUser) {
    console.error('[giveReward] User tidak ditemukan:', userId)
    return {
      success: false, newXp: 0, newCoins: 0,
      newLevel: 1, leveledUp: false, error: 'User tidak ditemukan'
    }
  }

  const oldXp = currentUser.xp ?? 0
  const oldCoins = currentUser.coins ?? 0
  const oldLevel = currentUser.level ?? 1

  const newXp = oldXp + xpGained
  const newCoins = oldCoins + coinsGained
  const newLevel = calculateLevel(newXp)
  const leveledUp = newLevel > oldLevel

  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({
      xp: newXp,
      coins: newCoins,
      level: newLevel
    })
    .eq('id', userId)
    .select('xp, coins, level')
    .maybeSingle()

  if (updateError) {
    console.error('[giveReward] Gagal update user:', updateError.message)
    return {
      success: false, newXp: oldXp, newCoins: oldCoins,
      newLevel: oldLevel, leveledUp: false, error: updateError.message
    }
  }

  if (!updatedUser) {
    console.error('[giveReward] Update tidak mengembalikan data — kemungkinan RLS policy menolak update')
    return {
      success: false, newXp: oldXp, newCoins: oldCoins,
      newLevel: oldLevel, leveledUp: false,
      error: 'Update gagal, kemungkinan RLS policy menolak'
    }
  }

  console.log('[giveReward] SUKSES:', { userId, oldXp, newXp: updatedUser.xp, oldCoins, newCoins: updatedUser.coins })

  return {
    success: true,
    newXp: updatedUser.xp,
    newCoins: updatedUser.coins,
    newLevel: updatedUser.level,
    leveledUp
  }
}
