require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('[battleEngine] SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY kosong!')
  console.error('[battleEngine] Pastikan backend/.env terisi dan dotenv di-load di server.js')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

// Map terpisah untuk menyimpan timeout, TIDAK di dalam room
const battleTimeouts = new Map()

// =====================
// MULAI BATTLE — INISIALISASI SOAL UNTUK SEMUA PEMAIN (MANUSIA + BOT)
// =====================
async function initBattle(room, roomCode, io) {
  const { data: questions, error } = await supabaseAdmin
    .from('pvp_questions')
    .select('*')
    .eq('mapel_id', room.mapelId)
    .eq('mode', room.mode)
    .limit(50)

  if (error || !questions || questions.length === 0) {
    console.error('[initBattle] Gagal ambil soal:', error?.message || 'Soal kosong')
    io.to(roomCode).emit('battle_error', {
      message: 'Soal untuk mapel/mode ini belum tersedia'
    })
    return false
  }

  const pool = [...questions].sort(() => Math.random() - 0.5).slice(0, 20)

  // SETIAP pemain (termasuk bot) dapat urutan soal sendiri
  room.players.forEach(player => {
    player.questionOrder = [...pool].sort(() => Math.random() - 0.5)
    player.currentQuestionIndex = 0
    player.score = 0
    player.answeredLog = []
    player.finished = false
  })

  room.totalQuestions = 20
  room.battleDurationMs = 60 * 1000  // 1 menit untuk testing kali ini, mudah dipantau
  room.battleStartedAt = Date.now()
  room.battleEndsAt = room.battleStartedAt + room.battleDurationMs
  room.status = 'battling'
  room.finished = false

  console.log(`[initBattle] Room ${roomCode} dimulai dengan ${pool.length} soal, ${room.players.length} pemain`)
  console.log(`[initBattle] battleDurationMs: ${room.battleDurationMs}`)
  console.log(`[initBattle] battleStartedAt: ${new Date(room.battleStartedAt).toISOString()}`)
  console.log(`[initBattle] battleEndsAt: ${new Date(room.battleEndsAt).toISOString()}`)

  // JALANKAN bot untuk SEMUA bot di room ini — WAJIB dipanggil
  room.players.filter(p => p.isBot).forEach(bot => {
    runBotAnswering(room, roomCode, bot, io)
  })

  // JADWALKAN auto-selesai battle saat waktu habis
  scheduleAutoFinish(room, roomCode, io)

  return true
}

// =====================
// BOT MENJAWAB SOAL SECARA TERUS-MENERUS SAMPAI BATTLE SELESAI/SOAL HABIS
// =====================
function runBotAnswering(room, roomCode, bot, io) {
  bot.botAccuracy = 0.80 + Math.random() * 0.15  // 80-95%, level hard

  function answerNext() {
    // STOP jika battle sudah selesai atau bot kehabisan soal
    if (room.finished || bot.currentQuestionIndex >= bot.questionOrder.length) {
      bot.finished = true
      return
    }

    const delay = 1500 + Math.random() * 2500 // 1.5 - 4 detik

    setTimeout(() => {
      // Cek lagi sebelum eksekusi, battle mungkin sudah selesai saat delay berjalan
      if (room.finished) return

      const currentQ = bot.questionOrder[bot.currentQuestionIndex]
      const isCorrect = Math.random() < bot.botAccuracy
      const pointsGained = isCorrect ? currentQ.points : 0

      bot.score += pointsGained
      bot.answeredLog.push({ question: currentQ.question_text, isCorrect })
      bot.currentQuestionIndex += 1

      console.log(`[Bot] ${bot.nama} skor sekarang: ${bot.score}`)

      broadcastScoreboard(room, roomCode, io)

      answerNext() // lanjut ke soal berikutnya secara rekursif
    }, delay)
  }

  answerNext() // MULAI proses bot menjawab — INI YANG SEBELUMNYA TIDAK TERPANGGIL
}

// =====================
// BROADCAST SKOR TERBARU KE SEMUA PEMAIN DI ROOM
// =====================
function broadcastScoreboard(room, roomCode, io) {
  const teamAScore = room.players
    .filter(p => p.team === 'A')
    .reduce((sum, p) => sum + p.score, 0)
  const teamBScore = room.players
    .filter(p => p.team === 'B')
    .reduce((sum, p) => sum + p.score, 0)

  console.log(`[broadcastScoreboard] Room ${roomCode} - Tim A: ${teamAScore}, Tim B: ${teamBScore}`)
  console.log(`[broadcastScoreboard] Detail pemain:`, room.players.map(p =>
    `${p.nama}(team:${p.team}, isBot:${p.isBot}, score:${p.score})`
  ))

  io.to(roomCode).emit('scoreboard_update', {
    players: room.players.map(p => ({
      userId: p.userId, nama: p.nama, score: p.score,
      team: p.team, isBot: p.isBot,
      avatarUrl: p.avatarUrl || null,
      frameConfig: p.frameConfig || null
    })),
    teamAScore,
    teamBScore
  })
}

// =====================
// PEMAIN MANUSIA SUBMIT JAWABAN
// =====================
async function handleSubmitAnswer(room, roomCode, player, selectedOption, socket, io) {
  if (room.finished) return

  const currentQ = player.questionOrder[player.currentQuestionIndex]
  if (!currentQ) return

  const isCorrect = selectedOption === currentQ.correct_option
  const pointsGained = isCorrect ? currentQ.points : 0

  player.score += pointsGained
  player.answeredLog.push({ question: currentQ.question_text, isCorrect })
  player.currentQuestionIndex += 1

  socket.emit('answer_result', {
    isCorrect,
    correctOption: currentQ.correct_option,
    pointsGained,
    newScore: player.score
  })

  broadcastScoreboard(room, roomCode, io)

  if (player.currentQuestionIndex >= player.questionOrder.length) {
    player.finished = true
    socket.emit('battle_finished_for_player', { score: player.score })
    return
  }

  // Kirim soal berikutnya setelah delay
  setTimeout(() => {
    if (room.finished) return
    const nextQ = player.questionOrder[player.currentQuestionIndex]
    if (!nextQ) return

    let options
    if (room.mode === 'kilat-menjawab') {
      options = { A: 'Benar', B: 'Salah' }
    } else {
      options = {
        A: nextQ.option_a,
        B: nextQ.option_b,
        C: nextQ.option_c,
        D: nextQ.option_d
      }
    }

    socket.emit('next_question', {
      questionNumber: player.currentQuestionIndex + 1,
      totalQuestions: room.totalQuestions,
      questionText: nextQ.question_text,
      options,
      timeLimitSeconds: room.mode === 'kilat-menjawab' ? 10 : 30,
      yourScore: player.score || 0,
      teamScore: 0
    })
  }, 1200)
}

// =====================
// AUTO-SELESAIKAN BATTLE SAAT WAKTU HABIS — INI YANG SEBELUMNYA TIDAK ADA
// =====================
function scheduleAutoFinish(room, roomCode, io) {
  const timeLeft = room.battleEndsAt - Date.now()

  if (timeLeft <= 0) {
    console.error(`[scheduleAutoFinish] PERINGATAN: timeLeft tidak valid (${timeLeft}ms) untuk room ${roomCode}. Battle TIDAK akan langsung diselesaikan, gunakan minimum 60 detik.`)
    room.battleEndsAt = Date.now() + 60000
  }

  const finalTimeLeft = room.battleEndsAt - Date.now()
  console.log(`[scheduleAutoFinish] Room ${roomCode} dijadwalkan selesai dalam ${finalTimeLeft}ms`)

  const timeoutHandle = setTimeout(() => {
    console.log(`[scheduleAutoFinish] TIMEOUT TERPICU untuk room ${roomCode}, memanggil finishBattle...`)
    finishBattle(room, roomCode, io)
  }, finalTimeLeft)

  // simpan terpisah, BUKAN sebagai room.autoFinishTimeout
  battleTimeouts.set(roomCode, timeoutHandle)
}

function clearBattleTimeout(roomCode) {
  const handle = battleTimeouts.get(roomCode)
  if (handle) {
    clearTimeout(handle)
    battleTimeouts.delete(roomCode)
  }
}

// =====================
// SELESAIKAN BATTLE — HITUNG PEMENANG, SIMPAN HASIL, KIRIM POPUP
// =====================
async function finishBattle(room, roomCode, io) {
  if (room.finished) return // cegah double-finish
  room.finished = true
  room.status = 'finished'

  clearBattleTimeout(roomCode)

  // Hentikan semua bot yang masih berjalan
  room.players.filter(p => p.isBot).forEach(bot => {
    bot.finished = true
  })

  const teamAScore = room.players
    .filter(p => p.team === 'A')
    .reduce((sum, p) => sum + p.score, 0)
  const teamBScore = room.players
    .filter(p => p.team === 'B')
    .reduce((sum, p) => sum + p.score, 0)

  const winnerTeam = teamAScore > teamBScore ? 'A'
    : teamBScore > teamAScore ? 'B'
    : 'draw'

  console.log(`[finishBattle] Room ${roomCode} - Tim A: ${teamAScore}, Tim B: ${teamBScore}, Pemenang: ${winnerTeam}`)

  // Simpan hasil ke database
  await saveBattleResult(room, roomCode, winnerTeam, teamAScore, teamBScore, io)

  console.log(`[finishBattle] saveBattleResult selesai dipanggil untuk room ${roomCode}`)

  // KIRIM hasil ke SETIAP pemain manusia secara individual
  room.players.filter(p => !p.isBot).forEach(player => {
    const isPlayerWinner = player.team === winnerTeam
    console.log(`[finishBattle] Mengirim battle_result ke ${player.nama} (isWinner: ${isPlayerWinner})`)
    io.to(roomCode).emit('battle_result', {
      isWinner: isPlayerWinner,
      isDraw: winnerTeam === 'draw',
      yourTeamScore: player.team === 'A' ? teamAScore : teamBScore,
      opponentTeamScore: player.team === 'A' ? teamBScore : teamAScore,
      yourScore: player.score,
      totalQuestions: room.totalQuestions,
      correctCount: player.answeredLog.filter(a => a.isCorrect).length,
      answeredLog: player.answeredLog,
      coinsEarned: isPlayerWinner ? 100 : 0
    })
  })
}

async function getPlayerData(supabaseAdmin, userId) {
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (!user) return null

  const { data: quests } = await supabaseAdmin
    .from("quests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  const { data: progress } = await supabaseAdmin
    .from("learning_progress")
    .select("*")
    .eq("user_id", userId)

  const { data: leaderboard } = await supabaseAdmin
    .from("users")
    .select("id, username, full_name, xp, level")
    .order("xp", { ascending: false })
    .limit(10)

  const progressMap = {}
  if (progress) {
    progress.forEach((p) => {
      progressMap[p.course_id] = {
        percentage: p.progress_percentage,
        completed: p.completed,
        currentLesson: p.current_lesson,
      }
    })
  }

  return {
    userId: user.id,
    username: user.username || "Santri",
    level: user.level,
    xp: user.xp,
    coins: user.coins,
    streak: user.streak,
    lastLoginDate: user.last_learning_date,
    totalLessons: user.xp > 0 ? Math.floor(user.xp / 10) : 0,
    totalQuests: quests ? quests.filter((q) => q.is_completed).length : 0,
    completedCourses: progress
      ? progress.filter((p) => p.completed).map((p) => p.course_id)
      : [],
    inventory: [],
    quests: quests || [],
    learningProgress: progressMap,
    leaderboard: leaderboard || [],
  }
}

// =====================
// SIMPAN HASIL BATTLE KE DATABASE
// =====================
async function saveBattleResult(room, roomCode, winnerTeam, teamAScore, teamBScore, io) {
  const { data: battleRecord, error: battleError } = await supabaseAdmin
    .from('pvp_battle_history')
    .insert({
      room_code: roomCode,
      mode: room.mode,
      mapel_id: room.mapelId
    })
    .select('id')
    .single()

  if (battleError || !battleRecord) {
    console.error('[saveBattleResult] GAGAL simpan history:', battleError?.message)
    return
  }

  console.log(`[saveBattleResult] Battle history tersimpan dengan id: ${battleRecord.id}`)

  const humanPlayers = room.players.filter(p => !p.isBot)

  const resultsToInsert = humanPlayers.map(player => ({
    battle_id: battleRecord.id,
    user_id: player.userId,
    is_bot: false,
    score: player.score,
    rank_in_battle: player.team === winnerTeam ? 1 : 2,
    is_winner: player.team === winnerTeam,
    coins_earned: player.team === winnerTeam ? 100 : 0
  }))

  const { error: resultsError } = await supabaseAdmin
    .from('pvp_battle_results')
    .insert(resultsToInsert)

  if (resultsError) {
    console.error('[saveBattleResult] GAGAL simpan results:', resultsError.message)
    return
  }

  console.log(`[saveBattleResult] ${resultsToInsert.length} hasil pemain tersimpan`)

  // Beri coins ke semua pemenang manusia dan kirim player_state ke frontend
  for (const player of humanPlayers.filter(p => p.team === winnerTeam)) {
    console.log(`[saveBattleResult] Memberi reward 100 koin ke pemenang: ${player.nama}`)
    const rewardResult = await giveReward(player.userId, 0, 100)
    console.log(`[saveBattleResult] Hasil giveReward:`, rewardResult)

    if (io && rewardResult?.success) {
      const playerData = await getPlayerData(supabaseAdmin, player.userId)
      if (playerData) {
        io.to(player.userId).emit('player_state', playerData)
        console.log(`[saveBattleResult] player_state dikirim ke ${player.userId}, coins sekarang ${playerData.coins}`)
      }
    }
  }
}

async function giveReward(userId, xpAmount, coinAmount) {
  try {
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('xp, coins, level')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.error(`[giveReward] User ${userId} tidak ditemukan:`, userError?.message)
      return { success: false, error: userError?.message }
    }

    console.log(`[giveReward] User ${userId} SEBELUM: coins=${user.coins}, xp=${user.xp}`)

    const newXp = (user.xp || 0) + xpAmount
    const newLevel = Math.floor(newXp / 100) + 1
    const newCoins = (user.coins || 0) + coinAmount

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        xp: newXp,
        level: newLevel,
        coins: newCoins,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('coins')
      .single()

    if (updateError) {
      console.error(`[giveReward] GAGAL update user ${userId}:`, updateError.message)
      return { success: false, error: updateError.message }
    }

    console.log(`[giveReward] User ${userId} SESUDAH: coins=${updatedUser?.coins} (target seharusnya ${newCoins})`)

    if (updatedUser?.coins !== newCoins) {
      console.error(`[giveReward] PERINGATAN: update tidak sesuai target! Kemungkinan RLS menolak update.`)
    }

    return { success: true, newCoins: updatedUser?.coins, newXp, newLevel }
  } catch (err) {
    console.error('[giveReward] error:', err)
    return { success: false, error: err.message }
  }
}

function sanitizeRoomForClient(room) {
  if (!room || !room.players) {
    console.warn('[sanitizeRoomForClient] room atau room.players tidak valid')
    return { roomCode: '', status: 'error', players: [] }
  }

  return {
    roomCode: room.roomCode || '',
    hostId: room.hostId || '',
    mode: room.mode || '',
    mapelId: room.mapelId || '',
    status: room.status || 'unknown',
    totalQuestions: room.totalQuestions || 0,
    battleStartedAt: room.battleStartedAt || null,
    battleEndsAt: room.battleEndsAt || null,
    players: room.players.map(p => ({
      userId: p.userId || '',
      nama: p.nama || '',
      asalSekolah: p.asalSekolah || '',
      avatarUrl: p.avatarUrl || null,
      frameConfig: p.frameConfig || null,
      isReady: p.isReady || false,
      isBot: p.isBot || false,
      score: p.score || 0,
      team: p.team || '',
      finished: p.finished || false
    }))
  }
}

module.exports = {
  initBattle,
  handleSubmitAnswer,
  finishBattle,
  broadcastScoreboard,
  sanitizeRoomForClient
}
