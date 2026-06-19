-- Jalankan SQL ini di Supabase SQL Editor

-- 1. Tabel users (profil user)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  coins INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_learning_date DATE,
  completed_nodes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel courses (daftar mata pelajaran/kurikulum)
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📖',
  color TEXT DEFAULT 'bg-emerald-100 text-emerald-600',
  kitab TEXT,
  ustadz TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel learning_progress (progress belajar user per course)
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0,
  current_lesson TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 4. Tabel quests (side quest user)
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Umum',
  category_color TEXT DEFAULT 'bg-purple-500',
  reward_xp INTEGER DEFAULT 0,
  reward_coins INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  total INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Trigger: auto-buat row di users saat user baru daftar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name, xp, level, coins, streak, completed_nodes)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    0, 1, 0, 0,
    '{}'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Trigger: update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 7. Seed data: courses (8 mapel kurikulum)
INSERT INTO public.courses (name, icon, color, kitab, ustadz, "order") VALUES
('Aqidah Dasar', '🕌', 'bg-emerald-100 text-emerald-600', 'Kitab Tauhid', 'Ust. Abdurrahman Thoyyib, Lc.', 1),
('Nahwu', '📖', 'bg-blue-100 text-blue-600', 'Matn Al-Ajurrumiyah', 'Ust. Faiz Al-Maliki, Lc.', 2),
('Shorof', '✍️', 'bg-amber-100 text-amber-600', 'Al-Amtsilah At-Tashrifiyyah', 'Ust. Hasyim Al-Asy''ari, S.Pd.I.', 3),
('Fiqh Ibadah', '🕋', 'bg-teal-100 text-teal-600', 'Matn Al-Ghayah wa At-Taqrib', 'Ust. Dr. Ahmad Zainuddin, Lc., M.A.', 4),
('Tajwid & Tahsin', '🎙️', 'bg-rose-100 text-rose-600', 'Hidayatul Mustafid', 'Ust. Farhan Al-Qur''ani, Lc.', 5),
('Adab & Akhlaq', '🤝', 'bg-green-100 text-green-600', 'Al-Akhlaq lil Banin', 'Ust. Muhammad Syakir, Lc.', 6),
('Sirah Nabawiyah', '🌙', 'bg-indigo-100 text-indigo-600', 'Ar-Rahiq Al-Makhtum', 'Ust. Dr. Haekal Al-Faruq, M.A.', 7),
('Tafsir Juz Amma', '📜', 'bg-orange-100 text-orange-600', 'Tafsir Juz Amma', 'Ust. Dr. Hafidz Al-Qurthubi, Lc., M.A.', 8)
ON CONFLICT DO NOTHING;

-- 8. Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

-- Users: hanya bisa membaca/mengupdate data sendiri
CREATE POLICY users_select_own ON public.users FOR SELECT USING (id = auth.uid());
CREATE POLICY users_update_own ON public.users FOR UPDATE USING (id = auth.uid());

-- Courses: semua user bisa lihat
CREATE POLICY courses_select_all ON public.courses FOR SELECT USING (TRUE);

-- Learning progress: hanya milik sendiri
CREATE POLICY lp_select_own ON public.learning_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY lp_insert_own ON public.learning_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY lp_update_own ON public.learning_progress FOR UPDATE USING (user_id = auth.uid());

-- Quests: hanya milik sendiri
CREATE POLICY quests_select_own ON public.quests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY quests_insert_own ON public.quests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY quests_update_own ON public.quests FOR UPDATE USING (user_id = auth.uid());
