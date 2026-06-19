require('dotenv').config()

const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const { createClient } = require("@supabase/supabase-js")
const { initBattle, handleSubmitAnswer, finishBattle, sanitizeRoomForClient } = require("./battleEngine")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

app.use(cors())

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('[server.js] SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY kosong di .env!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const XP_PER_LEVEL = 100
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 1500, 2250, 3250, 4500, 6000]
const streakRewards = { 3: 25, 5: 50, 7: 100, 14: 200, 21: 300, 30: 500, 50: 1000, 100: 2500 }

function calcLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

function calcLevelWithThresholds(xp) {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1
  }
  if (xp >= 6000) {
    level = 10 + Math.floor((xp - 6000) / 1500)
  }
  return level
}

function calcLevelXp(xp) {
  return { current: xp % XP_PER_LEVEL, max: XP_PER_LEVEL }
}

function calcStreakTarget(streak) {
  if (streak < 3) return 3
  if (streak < 5) return 5
  if (streak < 7) return 7
  if (streak < 14) return 14
  if (streak < 21) return 21
  if (streak < 30) return 30
  if (streak < 50) return 50
  return 100
}

function getStreakReward(streak) {
  return streakRewards[streak] || Math.min(streak * 5, 100)
}

const streakMessages = [
  "Kamu sudah belajar 1 hari berturut-turut. Ayo lanjutkan!",
  "Hari ke-2! Pertahankan semangatmu!",
  "3 hari berturut-turut! Luar biasa!",
  "4 hari! Konsistensi adalah kunci!",
  "5 hari! Kamu sedang membangun kebiasaan hebat!",
  "6 hari! Hampir satu minggu penuh!",
  "7 hari! Satu minggu penuh! Hebat!",
]

function getStreakMessage(streak) {
  return streak <= 7
    ? streakMessages[streak - 1] || streakMessages[0]
    : `Kamu sudah belajar ${streak} hari berturut-turut. Jangan berhenti!`
}

async function getPlayerData(userId) {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (!user) return null

  const { data: quests } = await supabase
    .from("quests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  const { data: progress } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", userId)

  const { data: leaderboard } = await supabase
    .from("users")
    .select("id, username, full_name, xp, level, avatar_url, equipped_bingkai_id")
    .order("xp", { ascending: false })
    .limit(10)

  const leaderboardUserIds = (leaderboard || []).filter(e => e.equipped_bingkai_id).map(e => e.equipped_bingkai_id)
  let frameConfigs = []
  if (leaderboardUserIds.length > 0) {
    const { data: frames } = await supabase
      .from("shop_items")
      .select("id, config")
      .in("id", leaderboardUserIds)
    frameConfigs = frames || []
  }
  const frameConfigMap = {}
  frameConfigs.forEach(f => { frameConfigMap[f.id] = f.config })

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
    avatarUrl: user.avatar_url || null,
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
    leaderboard: (leaderboard || []).map(e => ({
      id: e.id,
      username: e.username,
      full_name: e.full_name,
      xp: e.xp,
      level: e.level,
      avatarUrl: e.avatar_url || null,
      frameConfig: e.equipped_bingkai_id ? (frameConfigMap[e.equipped_bingkai_id] || null) : null
    })),
  }
}

const userSessions = new Map()
const userSocketMap = new Map()

const xpByType = { video: 30, materi: 20, latihan: 50, ujian: 100 }

function calcStreakTargetClient(streak) {
  if (streak < 3) return 3
  if (streak < 5) return 5
  if (streak < 7) return 7
  if (streak < 14) return 14
  if (streak < 21) return 21
  if (streak < 30) return 30
  if (streak < 50) return 50
  return 100
}

async function broadcastLeaderboard() {
  const { data: leaderboard } = await supabase
    .from("users")
    .select("id, username, full_name, xp, level, avatar_url, equipped_bingkai_id")
    .order("xp", { ascending: false })
    .limit(10)

  const frameIds = (leaderboard || []).filter(e => e.equipped_bingkai_id).map(e => e.equipped_bingkai_id)
  let frameMap = {}
  if (frameIds.length > 0) {
    const { data: frames } = await supabase
      .from("shop_items")
      .select("id, config")
      .in("id", frameIds)
    if (frames) frames.forEach(f => { frameMap[f.id] = f.config })
  }

  io.emit("leaderboard_update", (leaderboard || []).map(e => ({
    id: e.id,
    username: e.username,
    full_name: e.full_name,
    xp: e.xp,
    level: e.level,
    avatarUrl: e.avatar_url || null,
    frameConfig: e.equipped_bingkai_id ? (frameMap[e.equipped_bingkai_id] || null) : null
  })))
}

// =====================
// PVP BATTLE ROOMS
// =====================
const pvpRooms = new Map()

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

const BOT_NAMES = [
  { nama: "Yusuf Hakim", asal: "Ponpes Al-Fatih", avatarUrl: null },
  { nama: "Zaid Maulana", asal: "Ponpes Nurul Ilmi", avatarUrl: null },
  { nama: "Bilal Ramadhan", asal: "Ponpes Daarul Qur'an", avatarUrl: null },
  { nama: "Hamzah Fadlan", asal: "Ponpes Husnul Khotimah", avatarUrl: null },
  { nama: "Ridwan Akbar", asal: "Ponpes Al-Ihsan", avatarUrl: null },
  { nama: "Faiz Ibrahim", asal: "Ponpes Madinatul Ilmi", avatarUrl: null },
  { nama: "Sulthan Aziz", asal: "Ponpes Riyadhul Jannah", avatarUrl: null },
]

function getRandomBotIdentities(count) {
  const shuffled = [...BOT_NAMES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

io.on("connection", (socket) => {
  console.log("Connected:", socket.id)

  socket.on("user_login", async ({ userId }) => {
    if (!userId) return

    console.log("Login:", userId, "- Socket:", socket.id)

    const existingSocketId = userSocketMap.get(userId)
    if (existingSocketId && existingSocketId !== socket.id) {
      console.log(`Disconnecting old socket ${existingSocketId} for user ${userId}`)
      const oldSocket = io.sockets.sockets.get(existingSocketId)
      if (oldSocket) {
        oldSocket.disconnect(true)
      }
    }

    userSocketMap.set(userId, socket.id)

    try {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single()

      if (!existing) {
        const { error } = await supabase.from("users").insert({
          id: userId,
          username: "Santri",
          xp: 0,
          level: 1,
          coins: 0,
          streak: 0,
        })
        if (error) {
          console.error("User creation error:", error)
          return
        }
      }

      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (!user) return

      const today = new Date().toISOString().split("T")[0]
      let streakUpdated = false
      let newStreak = user.streak
      let showPopup = false
      let reward = 0

      if (user.last_learning_date !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split("T")[0]

        if (user.last_learning_date === yesterdayStr) {
          newStreak = user.streak + 1
        } else {
          newStreak = 1
        }

        reward = getStreakReward(newStreak)
        const newLevel = calcLevel(user.xp + reward)

        await supabase
          .from("users")
          .update({
            streak: newStreak,
            last_learning_date: today,
            xp: user.xp + reward,
            level: newLevel,
            coins: user.coins + reward,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        showPopup = true
        streakUpdated = true

        const nextTarget = calcStreakTarget(newStreak)
        socket.emit("show_streak_popup", {
          streakCount: newStreak,
          nextTarget,
          reward,
          message: getStreakMessage(newStreak),
        })

        await broadcastLeaderboard()
      }

      const playerData = await getPlayerData(userId)
      if (playerData) {
        socket.emit("player_state", playerData)
      }

      socket.join(userId)
      console.log(`Player ${userId} logged in, streak=${newStreak}`)
    } catch (err) {
      console.error("user_login error:", err)
    }
  })

  socket.on("gain_xp", async ({ userId, amount }) => {
    try {
      const { data: user } = await supabase
        .from("users")
        .select("xp, level")
        .eq("id", userId)
        .single()
      if (!user) return

      const newXp = user.xp + amount
      const newLevel = calcLevel(newXp)

      await supabase
        .from("users")
        .update({ xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
        .eq("id", userId)

      const playerData = await getPlayerData(userId)
      if (playerData) socket.emit("player_state", playerData)

      await broadcastLeaderboard()
    } catch (err) {
      console.error("gain_xp error:", err)
    }
  })

  socket.on("gain_coins", async ({ userId, amount }) => {
    try {
      const { data: user } = await supabase
        .from("users")
        .select("coins")
        .eq("id", userId)
        .single()
      if (!user) return

      await supabase
        .from("users")
        .update({
          coins: user.coins + amount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      const playerData = await getPlayerData(userId)
      if (playerData) socket.emit("player_state", playerData)
    } catch (err) {
      console.error("gain_coins error:", err)
    }
  })

  socket.on("complete_quest", async ({ userId, questId }) => {
    try {
      const { data: quest } = await supabase
        .from("quests")
        .select("*")
        .eq("id", questId)
        .single()
      if (!quest || quest.is_completed || quest.user_id !== userId) return

      const { data: user } = await supabase
        .from("users")
        .select("xp, level, coins")
        .eq("id", userId)
        .single()
      if (!user) return

      const xpReward = quest.reward_xp || 50
      const coinReward = quest.reward_coins || 20
      const newXp = user.xp + xpReward
      const newLevel = calcLevel(newXp)

      await supabase
        .from("quests")
        .update({ is_completed: true, progress: quest.total })
        .eq("id", questId)

      await supabase
        .from("users")
        .update({
          xp: newXp,
          level: newLevel,
          coins: user.coins + coinReward,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      const playerData = await getPlayerData(userId)
      if (playerData) socket.emit("player_state", playerData)

      await broadcastLeaderboard()
    } catch (err) {
      console.error("complete_quest error:", err)
    }
  })

  socket.on("join_session", ({ userId }) => {
    if (!userId) return

    let session = userSessions.get(userId)
    if (!session) {
      session = {
        streakCount: 0,
        lastLoginDate: null,
        xp: { total: 0, current: 0, max: 100, level: 1 },
        completedNodes: [],
        coins: 0,
      }
      userSessions.set(userId, session)
    }

    socket.join(`user:${userId}`)
    console.log(`Session joined: ${userId}`)

    socket.emit("session_data", {
      userId,
      streakCount: session.streakCount,
      lastLoginDate: session.lastLoginDate,
      xp: session.xp,
      completedNodes: session.completedNodes,
      coins: session.coins,
    })
  })

  socket.on("complete_node", async ({ userId, nodeId, mapel, tipe }) => {
    if (!userId || !nodeId) return

    let session = userSessions.get(userId)
    if (!session) {
      socket.emit("error", { message: "Session not found" })
      return
    }

    if (session.completedNodes.includes(nodeId)) {
      socket.emit("xp_updated", {
        userId,
        xpGained: 0,
        newTotal: session.xp.total,
        newCurrent: session.xp.current,
        newMax: session.xp.max,
        newLevel: session.xp.level,
        completedNodes: session.completedNodes,
      })
      return
    }

    session.completedNodes.push(nodeId)

    const xpGained = xpByType[tipe] || 30
    session.xp.current += xpGained
    session.xp.total += xpGained

    let didLevelUp = false
    let newLevel = session.xp.level

    while (session.xp.current >= session.xp.max) {
      session.xp.current -= session.xp.max
      session.xp.level += 1
      newLevel = session.xp.level
      session.xp.max = Math.floor(session.xp.max * 1.2)
      didLevelUp = true
    }

    userSessions.set(userId, session)

    try {
      await supabase
        .from("users")
        .update({
          xp: session.xp.total,
          level: session.xp.level,
          coins: session.coins,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      const { data: existingProgress } = await supabase
        .from("learning_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", mapel)
        .single()

      if (existingProgress) {
        await supabase
          .from("learning_progress")
          .update({
            current_lesson: nodeId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingProgress.id)
      } else {
        await supabase
          .from("learning_progress")
          .insert({
            user_id: userId,
            course_id: mapel,
            current_lesson: nodeId,
            progress_percentage: 0,
            completed: false,
          })
      }

      await broadcastLeaderboard()
    } catch (err) {
      console.error("complete_node supabase error:", err)
    }

    socket.emit("xp_updated", {
      userId,
      xpGained,
      newTotal: session.xp.total,
      newCurrent: session.xp.current,
      newMax: session.xp.max,
      newLevel: session.xp.level,
      completedNodes: [...session.completedNodes],
    })

    const playerData = await getPlayerData(userId)
    if (playerData) {
      socket.emit("player_state", playerData)
    }

    if (didLevelUp) {
      socket.emit("level_up", { newLevel, userId })

      io.to(`user:${userId}`).emit("player_state_update", {
        xp: session.xp.total,
        level: newLevel,
      })
    }
  })

  socket.on("complete_lesson", async ({ userId, lessonId }) => {
    if (!userId || !lessonId) return

    try {
      const { data: existing } = await supabase
        .from("lesson_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .single()

      if (existing) {
        socket.emit("lesson_already_done", { lessonId })
        return
      }

      await supabase.from("lesson_progress").insert({
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      })

      const { data: lesson } = await supabase
        .from("lessons")
        .select("xp_reward, diamond_reward, course_id")
        .eq("id", lessonId)
        .single()

      const xpReward = lesson?.xp_reward || 20
      const diamondReward = lesson?.diamond_reward || 50

      const { data: user } = await supabase
        .from("users")
        .select("xp, coins, level")
        .eq("id", userId)
        .single()

      const newXp = (user?.xp || 0) + xpReward
      const newCoins = (user?.coins || 0) + diamondReward
      const oldLevel = user?.level || 1
      const newLevel = calcLevelWithThresholds(newXp)
      const leveledUp = newLevel > oldLevel

      await supabase
        .from("users")
        .update({ xp: newXp, coins: newCoins, level: newLevel, updated_at: new Date().toISOString() })
        .eq("id", userId)

      const { data: allProgress } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", userId)
        .eq("completed", true)

      const updatedProgress = (allProgress || []).map((p) => p.lesson_id)

      let nextLessonId = null
      if (lesson?.course_id) {
        const { data: allLessons } = await supabase
          .from("lessons")
          .select("id")
          .eq("course_id", lesson.course_id)
          .order("order_number", { ascending: true })

        const next = (allLessons || []).find((l) => !updatedProgress.includes(l.id))
        nextLessonId = next?.id || null
      }

      socket.emit("lesson_completed", {
        lessonId,
        xpGained: xpReward,
        newXp,
        newLevel,
        leveledUp,
        updatedProgress,
        nextLessonId,
      })

      if (leveledUp) {
        socket.emit("level_up", { newLevel, userId })
      }

      await broadcastLeaderboard()

      const playerData = await getPlayerData(userId)
      if (playerData) {
        socket.emit("player_state", playerData)
      }
    } catch (err) {
      console.error("complete_lesson error:", err)
    }
  })

  socket.on("request_streak", ({ userId }) => {
    if (!userId) return

    let session = userSessions.get(userId)
    if (!session) {
      session = {
        streakCount: 0,
        lastLoginDate: null,
        xp: { total: 0, current: 0, max: 100, level: 1 },
        completedNodes: [],
        coins: 0,
      }
      userSessions.set(userId, session)
    }

    const today = new Date().toISOString().split("T")[0]
    let shouldShowPopup = false

    if (session.lastLoginDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split("T")[0]

      if (session.lastLoginDate === yesterdayStr) {
        session.streakCount += 1
      } else if (session.lastLoginDate === null) {
        session.streakCount = 1
      } else {
        session.streakCount = 1
      }

      session.lastLoginDate = today
      shouldShowPopup = true
      userSessions.set(userId, session)
    }

    socket.emit("streak_response", {
      userId,
      streakCount: session.streakCount,
      shouldShowPopup,
      nextTarget: calcStreakTargetClient(session.streakCount),
    })
  })

  // =====================
  // PVP: BUAT ROOM
  // =====================
  socket.on("create_room", async ({ userId, mode, mapelId }) => {
    const { data: userProfile } = await supabase
      .from("users")
      .select("id, username, full_name, avatar_url, equipped_bingkai_id")
      .eq("id", userId)
      .single()

    if (!userProfile) {
      socket.emit("room_error", { message: "User tidak ditemukan" })
      return
    }

    let frameConfig = null
    if (userProfile.equipped_bingkai_id) {
      const { data: frameItem } = await supabase
        .from("shop_items")
        .select("config")
        .eq("id", userProfile.equipped_bingkai_id)
        .single()
      frameConfig = frameItem?.config || null
    }

    const roomCode = generateRoomCode()

    const newRoom = {
      roomCode,
      hostId: userId,
      mode,
      mapelId,
      status: "lobby",
      players: [{
        userId: userProfile.id,
        nama: userProfile.full_name || userProfile.username || "Santri",
        asalSekolah: "RuangSantri",
        avatarUrl: userProfile.avatar_url,
        frameConfig,
        isReady: false,
        isBot: false,
        socketId: socket.id,
        score: 0,
      }],
      createdAt: Date.now(),
    }

    pvpRooms.set(roomCode, newRoom)
    socket.join(roomCode)

    socket.emit("room_created", { roomCode, room: sanitizeRoomForClient(newRoom) })
    io.to(roomCode).emit("room_updated", { room: sanitizeRoomForClient(newRoom) })
  })

  // =====================
  // PVP: GABUNG ROOM
  // =====================
  socket.on("join_room", async ({ userId, roomCode }) => {
    const room = pvpRooms.get(roomCode)

    if (!room) {
      socket.emit("room_error", { message: "Kode room tidak ditemukan" })
      return
    }
    if (room.status !== "lobby") {
      socket.emit("room_error", { message: "Room sudah mulai battle" })
      return
    }
    if (room.players.filter(p => !p.isBot).length >= 5) {
      socket.emit("room_error", { message: "Room sudah penuh" })
      return
    }
    if (room.players.some(p => p.userId === userId)) {
      socket.emit("room_error", { message: "Kamu sudah ada di room ini" })
      return
    }

    const { data: userProfile } = await supabase
      .from("users")
      .select("id, username, full_name, avatar_url, equipped_bingkai_id")
      .eq("id", userId)
      .single()

    if (!userProfile) {
      socket.emit("room_error", { message: "User tidak ditemukan" })
      return
    }

    let frameConfig = null
    if (userProfile.equipped_bingkai_id) {
      const { data: frameItem } = await supabase
        .from("shop_items")
        .select("config")
        .eq("id", userProfile.equipped_bingkai_id)
        .single()
      frameConfig = frameItem?.config || null
    }

    room.players.push({
      userId: userProfile.id,
      nama: userProfile.full_name || userProfile.username || "Santri",
      asalSekolah: "RuangSantri",
      avatarUrl: userProfile.avatar_url,
      frameConfig,
      isReady: false,
      isBot: false,
      socketId: socket.id,
      score: 0,
    })

    socket.join(roomCode)

    io.to(roomCode).emit("room_updated", { room: sanitizeRoomForClient(room) })
  })

  // =====================
  // PVP: TOGGLE READY
  // =====================
  socket.on("toggle_ready", ({ userId, roomCode }) => {
    const room = pvpRooms.get(roomCode)
    if (!room) return

    const player = room.players.find(p => p.userId === userId)
    if (!player) return

    player.isReady = !player.isReady

    io.to(roomCode).emit("room_updated", { room: sanitizeRoomForClient(room) })
  })

  // =====================
  // PVP: MULAI BATTLE
  // =====================
  socket.on("start_battle", async ({ userId, roomCode }) => {
    const room = pvpRooms.get(roomCode)
    if (!room) {
      console.error(`[start_battle] Room ${roomCode} tidak ditemukan di pvpRooms`)
      return
    }

    console.log(`[start_battle] Memulai battle untuk room ${roomCode}`)

    if (room.hostId !== userId) {
      socket.emit("room_error", { message: "Hanya host yang bisa mulai battle" })
      return
    }

    const humanPlayers = room.players.filter(p => !p.isBot)
    const allHumanReady = humanPlayers.every(p => p.isReady)

    if (!allHumanReady) {
      socket.emit("room_error", { message: "Semua pemain harus siap dulu" })
      return
    }

    // SEMUA manusia yang sudah join room = Tim A
    const humanPlayersExplicit = room.players.filter(p => !p.isBot)
    humanPlayersExplicit.forEach(p => { p.team = 'A' })

    // Isi slot kosong Tim A dengan bot pengisi (maks 5 per tim)
    const slotsNeededTeamA = 5 - humanPlayersExplicit.length
    if (slotsNeededTeamA > 0) {
      const botIdentitiesA = getRandomBotIdentities(slotsNeededTeamA)
      botIdentitiesA.forEach((identity, idx) => {
        room.players.push({
          userId: `bot-teamA-${roomCode}-${idx}`,
          nama: identity.nama,
          asalSekolah: identity.asal,
          avatarUrl: identity.avatarUrl,
          frameConfig: null,
          isReady: true,
          isBot: true,
          socketId: null,
          score: 0,
          team: 'A'
        })
      })
    }

    // Tim B SELALU diisi 5 bot (tim lawan sepenuhnya AI)
    const botIdentitiesB = getRandomBotIdentities(5)
    botIdentitiesB.forEach((identity, idx) => {
      room.players.push({
        userId: `bot-teamB-${roomCode}-${idx}`,
        nama: identity.nama,
        asalSekolah: identity.asal,
        avatarUrl: identity.avatarUrl,
        frameConfig: null,
        isReady: true,
        isBot: true,
        socketId: null,
        score: 0,
        team: 'B'
      })
    })

    console.log(`[start_battle] Room ${roomCode} - Tim A: ${room.players.filter(p => p.team === 'A').length} pemain, Tim B: ${room.players.filter(p => p.team === 'B').length} pemain`)

    // PANGGIL initBattle dulu — untuk set battleEndsAt dan lainnya
    const success = await initBattle(room, roomCode, io)
    if (!success) {
      console.error(`[start_battle] initBattle GAGAL untuk room ${roomCode}`)
      return
    }

    console.log(`[start_battle] initBattle SUKSES, room sekarang status: ${room.status}, battleEndsAt: ${room.battleEndsAt}`)

    // BARU kirim battle_started — room sudah punya battleEndsAt (untuk timer)
    try {
      io.to(roomCode).emit('battle_started', { room: sanitizeRoomForClient(room) })
    } catch (err) {
      console.error(`[start_battle] Gagal emit battle_started:`, err)
      return
    }
  })

  // =====================
  // PVP: SUBMIT JAWABAN
  // =====================
  socket.on('submit_answer', ({ userId, roomCode, selectedOption }) => {
    const room = pvpRooms.get(roomCode)
    if (!room) return
    const player = room.players.find(p => p.userId === userId)
    if (!player) return

    handleSubmitAnswer(room, roomCode, player, selectedOption, socket, io)
  })

  // =====================
  // PVP: REQUEST ROOM STATE (untuk refresh halaman)
  // =====================
  socket.on("request_room_state", ({ roomCode }) => {
    const room = pvpRooms.get(roomCode)
    if (room) {
      console.log(`[request_room_state] Mengirim state room ${roomCode}, status: ${room.status}, battleEndsAt: ${room.battleEndsAt}`)
      socket.emit("room_updated", { room: sanitizeRoomForClient(room) })
    } else {
      socket.emit("room_error", { message: "Room tidak ditemukan" })
    }
  })

  // =====================
  // PVP: AMBIL STATISTIK USER
  // =====================
  socket.on('get_pvp_stats', async ({ userId }) => {
    if (!userId) {
      socket.emit('pvp_stats_result', { winRate: 0, totalBattle: 0, bestRank: null })
      return
    }

    const { data: results, error } = await supabase
      .from('pvp_battle_results')
      .select('is_winner, rank_in_battle')
      .eq('user_id', userId)

    if (error) {
      console.error('[get_pvp_stats] ERROR DETAIL:', error.message, error.details, error.hint)
      socket.emit('pvp_stats_result', { winRate: 0, totalBattle: 0, bestRank: null })
      return
    }

    console.log(`[get_pvp_stats] User ${userId} punya ${results?.length || 0} hasil battle`)

    const totalBattle = results?.length || 0
    const totalWins = results?.filter(r => r.is_winner).length || 0
    const winRate = totalBattle > 0 ? Math.round((totalWins / totalBattle) * 100) : 0
    const bestRank = totalBattle > 0 ? Math.min(...results.map(r => r.rank_in_battle)) : null

    socket.emit('pvp_stats_result', { winRate, totalBattle, bestRank })
  })

  // =====================
  // PVP: LEADERBOARD
  // =====================
  socket.on('get_pvp_leaderboard', async () => {
    const { data: allResults, error } = await supabase
      .from('pvp_battle_results')
      .select('user_id, is_winner')

    if (error || !allResults) {
      console.error('[get_pvp_leaderboard] error:', error?.message)
      socket.emit('pvp_leaderboard_result', [])
      return
    }

    const statsByUser = {}
    allResults.forEach(r => {
      if (!statsByUser[r.user_id]) {
        statsByUser[r.user_id] = { totalBattle: 0, totalWins: 0 }
      }
      statsByUser[r.user_id].totalBattle += 1
      if (r.is_winner) statsByUser[r.user_id].totalWins += 1
    })

    const userIds = Object.keys(statsByUser)
    if (userIds.length === 0) {
      socket.emit('pvp_leaderboard_result', [])
      return
    }

    const { data: profiles } = await supabase
      .from('users')
      .select('id, username, full_name, avatar_url, equipped_bingkai_id')
      .in('id', userIds)

    const frameIds = (profiles || []).filter(p => p.equipped_bingkai_id).map(p => p.equipped_bingkai_id)
    let frameMap = {}
    if (frameIds.length > 0) {
      const { data: frames } = await supabase
        .from('shop_items')
        .select('id, config')
        .in('id', frameIds)
      if (frames) frames.forEach(f => { frameMap[f.id] = f.config })
    }

    const leaderboard = userIds.map(userId => {
      const profile = profiles?.find(p => p.id === userId)
      const stats = statsByUser[userId]
      const winRate = stats.totalBattle > 0
        ? Math.round((stats.totalWins / stats.totalBattle) * 100)
        : 0
      return {
        userId,
        nama: profile?.full_name || profile?.username || 'Santri',
        avatarUrl: profile?.avatar_url || null,
        frameConfig: profile?.equipped_bingkai_id ? (frameMap[profile.equipped_bingkai_id] || null) : null,
        totalBattle: stats.totalBattle,
        totalWins: stats.totalWins,
        winRate
      }
    })

    leaderboard.sort((a, b) => {
      if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins
      return b.winRate - a.winRate
    })

    socket.emit('pvp_leaderboard_result', leaderboard.slice(0, 50))
  })

  // =====================
  // PVP: MINTA SOAL SAAT INI (untuk refresh page / reconnect)
  // =====================
  socket.on('request_current_question', ({ userId, roomCode }) => {
    const room = pvpRooms.get(roomCode)
    if (!room || room.status !== 'battling') return
    const player = room.players.find(p => p.userId === userId)
    if (!player) return

    if (player.currentQuestionIndex >= player.questionOrder.length) {
      socket.emit('battle_finished_for_player', { score: player.score })
      return
    }

    const currentQ = player.questionOrder[player.currentQuestionIndex]
    if (!currentQ) return

    let options
    if (room.mode === 'kilat-menjawab') {
      options = { A: 'Benar', B: 'Salah' }
    } else {
      options = {
        A: currentQ.option_a,
        B: currentQ.option_b,
        C: currentQ.option_c,
        D: currentQ.option_d
      }
    }

    socket.emit('next_question', {
      questionNumber: player.currentQuestionIndex + 1,
      totalQuestions: room.totalQuestions,
      questionText: currentQ.question_text,
      options,
      timeLimitSeconds: room.mode === 'kilat-menjawab' ? 10 : 30,
      yourScore: player.score || 0,
      teamScore: 0
    })
  })

  // Event jika pemain klik X / keluar battle (otomatis selesai untuk dirinya)
  socket.on('leave_battle', ({ userId, roomCode }) => {
    const room = pvpRooms.get(roomCode)
    if (!room) return
    const player = room.players.find(p => p.userId === userId)
    if (player) player.finished = true
  })

  // =====================
  // TOKO ITEM: BELI
  // =====================
  socket.on('buy_item', async ({ userId, itemId }) => {
    try {
      const { data: item, error: itemError } = await supabase
        .from('shop_items')
        .select('*')
        .eq('id', itemId)
        .single()

      if (itemError || !item) {
        socket.emit('buy_item_result', { success: false, message: 'Item tidak ditemukan' })
        return
      }

      const { data: existing } = await supabase
        .from('user_inventory')
        .select('id')
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .single()

      if (existing) {
        socket.emit('buy_item_result', { success: false, message: 'Item sudah dimiliki' })
        return
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('coins')
        .eq('id', userId)
        .single()

      if (userError || !user) {
        socket.emit('buy_item_result', { success: false, message: 'User tidak ditemukan' })
        return
      }

      if (user.coins < item.price) {
        socket.emit('buy_item_result', { success: false, message: 'Koin tidak cukup' })
        return
      }

      const { error: insertError } = await supabase
        .from('user_inventory')
        .insert({ user_id: userId, item_id: itemId })

      if (insertError) {
        console.error('[buy_item] Gagal insert inventory:', insertError.message)
        socket.emit('buy_item_result', { success: false, message: 'Gagal menyimpan pembelian' })
        return
      }

      const newCoins = user.coins - item.price
      const { error: updateError } = await supabase
        .from('users')
        .update({ coins: newCoins })
        .eq('id', userId)

      if (updateError) {
        console.error('[buy_item] Gagal kurangi koin:', updateError.message)
      }

      console.log(`[buy_item] User ${userId} berhasil membeli ${item.name}, sisa koin: ${newCoins}`)

      socket.emit('buy_item_result', {
        success: true,
        message: `Berhasil membeli ${item.name}!`,
        newCoins,
        item
      })
    } catch (err) {
      console.error('[buy_item] error:', err)
      socket.emit('buy_item_result', { success: false, message: 'Terjadi kesalahan' })
    }
  })

  // =====================
  // TOKO ITEM: PAKAI
  // =====================
  socket.on('equip_item', async ({ userId, itemId, category }) => {
    try {
      const { data: owned } = await supabase
        .from('user_inventory')
        .select('id')
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .single()

      if (!owned) {
        socket.emit('equip_item_result', { success: false, message: 'Item belum dimiliki' })
        return
      }

      const columnMap = {
        bingkai: 'equipped_bingkai_id',
        tema: 'equipped_tema_id',
        efek: 'equipped_efek_id'
      }
      const column = columnMap[category]
      if (!column) {
        socket.emit('equip_item_result', { success: false, message: 'Kategori tidak valid' })
        return
      }

      const { error } = await supabase
        .from('users')
        .update({ [column]: itemId })
        .eq('id', userId)

      if (error) {
        console.error('[equip_item] error:', error.message)
        socket.emit('equip_item_result', { success: false, message: 'Gagal memakai item' })
        return
      }

      console.log(`[equip_item] User ${userId} memakai item ${itemId} kategori ${category}`)
      socket.emit('equip_item_result', { success: true, itemId, category })
    } catch (err) {
      console.error('[equip_item] error:', err)
    }
  })

  // =====================
  // TOKO ITEM: LEPAS
  // =====================
  socket.on('unequip_item', async ({ userId, category }) => {
    const columnMap = {
      bingkai: 'equipped_bingkai_id',
      tema: 'equipped_tema_id',
      efek: 'equipped_efek_id'
    }
    const column = columnMap[category]
    if (!column) return

    await supabase.from('users').update({ [column]: null }).eq('id', userId)
    socket.emit('unequip_item_result', { success: true, category })
  })

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id)

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId)
        console.log(`Cleaned up user ${userId} from socket map`)
        break
      }
    }

    for (const [roomCode, room] of pvpRooms) {
      const idx = room.players.findIndex(p => p.socketId === socket.id)
      if (idx !== -1) {
        room.players.splice(idx, 1)
        if (room.players.length === 0) {
          pvpRooms.delete(roomCode)
        } else {
          io.to(roomCode).emit("room_updated", { room: sanitizeRoomForClient(room) })
        }
      }
    }
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log("RuangSantri Game Server berjalan di port " + PORT)
})
