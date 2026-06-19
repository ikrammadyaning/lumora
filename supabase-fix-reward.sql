-- ================================================================
-- FIX SYSTEM REWARD - Jalankan di Supabase SQL Editor
-- ================================================================

-- 1. ADD diamond COLUMN (ROOT CAUSE: kolom ini TIDAK ADA!)
ALTER TABLE users ADD COLUMN IF NOT EXISTS diamond INTEGER NOT NULL DEFAULT 0;

-- 2. ADD completed_nodes column if missing
ALTER TABLE users ADD COLUMN IF NOT EXISTS completed_nodes TEXT[] DEFAULT '{}';

-- 3. VERIFY RLS POLICY FOR USERS UPDATE
-- Pastikan users_update_own policy ada
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. VERIFY RLS FOR lesson_progress
DROP POLICY IF EXISTS "lesson_progress_select" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_insert" ON public.lesson_progress;
DROP POLICY IF EXISTS "lp_select_own" ON public.lesson_progress;
DROP POLICY IF EXISTS "lp_insert_own" ON public.lesson_progress;

CREATE POLICY "lesson_progress_select"
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "lesson_progress_insert"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. FIX REWARD DATA: Pastikan semua lesson punya xp_reward dan diamond_reward
-- Sesuaikan diamond_reward yang masih 10/20 menjadi nilai yang sesuai
UPDATE lessons SET diamond_reward = 30 WHERE type = 'video' AND diamond_reward < 30;
UPDATE lessons SET diamond_reward = 50 WHERE type = 'materi' AND diamond_reward < 50;
UPDATE lessons SET diamond_reward = 75 WHERE type = 'latihan' AND diamond_reward < 75;
UPDATE lessons SET diamond_reward = 100 WHERE type = 'ujian' AND diamond_reward < 100;

-- 6. VERIFY RESULTS
SELECT 'users columns:' as info, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('xp', 'diamond', 'coins', 'level')
ORDER BY column_name;

SELECT 'RLS policies for users:' as info, policyname, permissive, cmd
FROM pg_policies WHERE tablename = 'users';

SELECT 'Lessons with reward issues:' as info, count(*) 
FROM lessons WHERE xp_reward IS NULL OR diamond_reward IS NULL;
