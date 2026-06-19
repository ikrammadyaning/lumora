const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 1500, 2250, 3250, 4500, 6000]

export function calcLevel(xp: number): number {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1
  }
  if (xp >= 6000) {
    level = 10 + Math.floor((xp - 6000) / 1500)
  }
  return level
}

export function calcLevelProgress(xp: number): { current: number; max: number } {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      const next = LEVEL_THRESHOLDS[i + 1]
      if (!next) {
        const inLevel = (xp - 6000) % 1500
        return { current: inLevel, max: 1500 }
      }
      return { current: xp - LEVEL_THRESHOLDS[i], max: next - LEVEL_THRESHOLDS[i] }
    }
  }
  return { current: xp, max: 100 }
}
