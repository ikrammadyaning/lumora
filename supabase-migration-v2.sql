-- Jalankan SQL ini di Supabase SQL Editor setelah migration pertama

-- 1. Tambah kolom baru ke tabel courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS order_number integer DEFAULT 0;

UPDATE courses SET title = name WHERE title IS NULL;
UPDATE courses SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
UPDATE courses SET order_number = "order" WHERE order_number IS NULL OR order_number = 0;
UPDATE courses SET description = CONCAT('Pelajari ', name, ' secara sistematis bersama RuangSantri') WHERE description IS NULL;

ALTER TABLE courses ALTER COLUMN title SET NOT NULL;
ALTER TABLE courses ALTER COLUMN slug SET NOT NULL;
ALTER TABLE courses ALTER COLUMN description SET NOT NULL;
ALTER TABLE courses ALTER COLUMN order_number SET NOT NULL;

-- 2. Tabel lessons (node belajar)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('video', 'materi', 'latihan', 'ujian')),
  video_url text,
  content text,
  xp_reward integer NOT NULL DEFAULT 20,
  diamond_reward integer NOT NULL DEFAULT 50,
  order_number integer NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel lesson_progress (progress per user per lesson)
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- 4. Seed data: lessons tiap course
-- Aqidah Dasar
INSERT INTO lessons (course_id, title, type, video_url, content, xp_reward, diamond_reward, order_number)
SELECT id, 'Makna Syahadat', 'materi', NULL, 'Syahadat adalah pintu masuk Islam. Pelajari makna La Ilaha Illallah dan Muhammadur Rasulullah.', 20, 50, 1 FROM courses WHERE slug = 'aqidah-dasar'
UNION ALL
SELECT id, 'Video: Syahadat', 'video', NULL, NULL, 30, 30, 2 FROM courses WHERE slug = 'aqidah-dasar'
UNION ALL
SELECT id, 'Latihan 1: Syahadat', 'latihan', NULL, 'Jawablah pertanyaan seputar syahadatain.', 50, 75, 3 FROM courses WHERE slug = 'aqidah-dasar'
UNION ALL
SELECT id, 'Keutamaan Tauhid', 'materi', NULL, 'Tauhid adalah inti ajaran Islam. Pelajari keutamaan dan kedudukannya.', 20, 50, 4 FROM courses WHERE slug = 'aqidah-dasar'
UNION ALL
SELECT id, 'Video: Keutamaan Tauhid', 'video', NULL, NULL, 30, 30, 5 FROM courses WHERE slug = 'aqidah-dasar'
UNION ALL
SELECT id, 'Ujian Bab Dasar', 'ujian', NULL, 'Evaluasi pemahaman tentang tauhid dan syahadat.', 100, 100, 6 FROM courses WHERE slug = 'aqidah-dasar';

-- Nahwu
INSERT INTO lessons (course_id, title, type, video_url, content, xp_reward, diamond_reward, order_number)
SELECT id, 'Pengantar Ilmu Nahwu', 'video', NULL, NULL, 30, 30, 1 FROM courses WHERE slug = 'nahwu'
UNION ALL
SELECT id, 'Pembagian Kalimah', 'materi', NULL, 'Kalimah terbagi menjadi isim, fi''il, dan huruf.', 20, 50, 2 FROM courses WHERE slug = 'nahwu'
UNION ALL
SELECT id, 'Latihan 1: Kalimah', 'latihan', NULL, 'Identifikasi jenis-jenis kalimah dalam ayat.', 50, 75, 3 FROM courses WHERE slug = 'nahwu'
UNION ALL
SELECT id, 'Marfaat Isim', 'video', NULL, NULL, 30, 30, 4 FROM courses WHERE slug = 'nahwu'
UNION ALL
SELECT id, 'Tanda-Tanda Isim', 'materi', NULL, 'Kenali ciri-ciri isim: khafadh, tanwin, dan alif lam.', 20, 50, 5 FROM courses WHERE slug = 'nahwu'
UNION ALL
SELECT id, 'Ujian Nahwu Dasar', 'ujian', NULL, 'Evaluasi pemahaman ilmu nahwu level dasar.', 100, 100, 6 FROM courses WHERE slug = 'nahwu';

-- Shorof
INSERT INTO lessons (course_id, title, type, video_url, content, xp_reward, diamond_reward, order_number)
SELECT id, 'Pengantar Ilmu Shorof', 'video', NULL, NULL, 30, 30, 1 FROM courses WHERE slug = 'shorof'
UNION ALL
SELECT id, 'Wazan Dasar', 'materi', NULL, 'Wazan adalah pola dasar dalam pembentukan kata bahasa Arab.', 20, 50, 2 FROM courses WHERE slug = 'shorof'
UNION ALL
SELECT id, 'Latihan Wazan', 'latihan', NULL, 'Praktik mengidentifikasi wazan kata.', 50, 75, 3 FROM courses WHERE slug = 'shorof'
UNION ALL
SELECT id, 'Tashrif Lughawi', 'video', NULL, NULL, 30, 30, 4 FROM courses WHERE slug = 'shorof'
UNION ALL
SELECT id, 'Ujian Shorof Dasar', 'ujian', NULL, 'Evaluasi pemahaman shorof dasar.', 100, 100, 5 FROM courses WHERE slug = 'shorof';

-- Fiqh Ibadah
INSERT INTO lessons (course_id, title, type, video_url, content, xp_reward, diamond_reward, order_number)
SELECT id, 'Pengantar Fiqh Ibadah', 'materi', NULL, 'Fiqh ibadah mengatur hubungan hamba dengan Allah.', 20, 50, 1 FROM courses WHERE slug = 'fiqh-ibadah'
UNION ALL
SELECT id, 'Thaharah (Bersuci)', 'video', NULL, NULL, 30, 30, 2 FROM courses WHERE slug = 'fiqh-ibadah'
UNION ALL
SELECT id, 'Tata Cara Wudhu', 'video', NULL, NULL, 30, 30, 3 FROM courses WHERE slug = 'fiqh-ibadah'
UNION ALL
SELECT id, 'Latihan: Thaharah', 'latihan', NULL, 'Soal-soal seputar thaharah dan wudhu.', 50, 75, 4 FROM courses WHERE slug = 'fiqh-ibadah'
UNION ALL
SELECT id, 'Najis dan Cara Mensucikannya', 'materi', NULL, 'Pelajari jenis-jenis najis dan cara menyucikannya.', 20, 50, 5 FROM courses WHERE slug = 'fiqh-ibadah'
UNION ALL
SELECT id, 'Ujian Fiqh Ibadah', 'ujian', NULL, 'Evaluasi pemahaman fiqh ibadah.', 100, 100, 6 FROM courses WHERE slug = 'fiqh-ibadah';

-- Tajwid & Tahsin
INSERT INTO lessons (course_id, title, type, video_url, content, xp_reward, diamond_reward, order_number)
SELECT id, 'Pengantar Ilmu Tajwid', 'materi', NULL, 'Tajwid adalah ilmu membaca Al-Qur''an dengan baik dan benar.', 20, 50, 1 FROM courses WHERE slug = 'tajwid-tahsin'
UNION ALL
SELECT id, 'Makharijul Huruf', 'video', NULL, NULL, 30, 30, 2 FROM courses WHERE slug = 'tajwid-tahsin'
UNION ALL
SELECT id, 'Sifatul Huruf', 'video', NULL, NULL, 30, 30, 3 FROM courses WHERE slug = 'tajwid-tahsin'
UNION ALL
SELECT id, 'Latihan Makhraj & Sifat', 'latihan', NULL, 'Praktik mengidentifikasi makhraj dan sifat huruf.', 50, 75, 4 FROM courses WHERE slug = 'tajwid-tahsin'
UNION ALL
SELECT id, 'Hukum Nun Sukun & Tanwin', 'materi', NULL, 'Pelajari izhar, idgham, iqlab, dan ikhfa.', 20, 50, 5 FROM courses WHERE slug = 'tajwid-tahsin'
UNION ALL
SELECT id, 'Ujian Tajwid Dasar', 'ujian', NULL, 'Evaluasi pemahaman tajwid dasar.', 100, 100, 6 FROM courses WHERE slug = 'tajwid-tahsin';

-- Adab & Akhlaq
INSERT INTO lessons (course_id, title, type, video_url, content, xp_reward, diamond_reward, order_number)
SELECT id, 'Pentingnya Adab', 'video', NULL, NULL, 30, 30, 1 FROM courses WHERE slug = 'adab-akhlaq'
UNION ALL
SELECT id, 'Adab kepada Orang Tua', 'materi', NULL, 'Birrul walidain adalah kewajiban setiap muslim.', 20, 50, 2 FROM courses WHERE slug = 'adab-akhlaq'
UNION ALL
SELECT id, 'Adab kepada Guru', 'video', NULL, NULL, 30, 30, 3 FROM courses WHERE slug = 'adab-akhlaq'
UNION ALL
SELECT id, 'Latihan: Adab', 'latihan', NULL, 'Soal-soal seputar adab dalam Islam.', 50, 75, 4 FROM courses WHERE slug = 'adab-akhlaq'
UNION ALL
SELECT id, 'Ujian Adab & Akhlaq', 'ujian', NULL, 'Evaluasi pemahaman adab dan akhlaq.', 100, 100, 5 FROM courses WHERE slug = 'adab-akhlaq';

-- Sirah Nabawiyah
INSERT INTO lessons (course_id, title, type, video_url, content, xp_reward, diamond_reward, order_number)
SELECT id, 'Makkah Sebelum Islam', 'materi', NULL, 'Kondisi masyarakat Arab sebelum diutusnya Nabi Muhammad.', 20, 50, 1 FROM courses WHERE slug = 'sirah-nabawiyah'
UNION ALL
SELECT id, 'Kelahiran Rasulullah ﷺ', 'video', NULL, NULL, 30, 30, 2 FROM courses WHERE slug = 'sirah-nabawiyah'
UNION ALL
SELECT id, 'Masa Kanak-Kanak', 'materi', NULL, 'Masa kecil Nabi Muhammad ﷺ bersama kakek dan pamannya.', 20, 50, 3 FROM courses WHERE slug = 'sirah-nabawiyah'
UNION ALL
SELECT id, 'Latihan: Sirah Awal', 'latihan', NULL, 'Soal-soal seputar sirah nabawiyah awal.', 50, 75, 4 FROM courses WHERE slug = 'sirah-nabawiyah'
UNION ALL
SELECT id, 'Ujian Sirah Nabawiyah', 'ujian', NULL, 'Evaluasi pemahaman sirah nabawiyah.', 100, 100, 5 FROM courses WHERE slug = 'sirah-nabawiyah';

-- Tafsir Juz Amma
INSERT INTO lessons (course_id, title, type, video_url, content, xp_reward, diamond_reward, order_number)
SELECT id, 'Pengantar Tafsir Juz Amma', 'video', NULL, NULL, 30, 30, 1 FROM courses WHERE slug = 'tafsir-juz-amma'
UNION ALL
SELECT id, 'Tafsir Surah An-Nas', 'materi', NULL, 'Tafsir dan penjelasan Surah An-Nas ayat per ayat.', 20, 50, 2 FROM courses WHERE slug = 'tafsir-juz-amma'
UNION ALL
SELECT id, 'Tafsir Surah Al-Ikhlas', 'video', NULL, NULL, 30, 30, 3 FROM courses WHERE slug = 'tafsir-juz-amma'
UNION ALL
SELECT id, 'Tafsir Surah Al-Falaq', 'materi', NULL, 'Tafsir dan penjelasan Surah Al-Falaq.', 20, 50, 4 FROM courses WHERE slug = 'tafsir-juz-amma'
UNION ALL
SELECT id, 'Latihan: Tafsir', 'latihan', NULL, 'Soal-soal seputar tafsir surah-surah pendek.', 50, 75, 5 FROM courses WHERE slug = 'tafsir-juz-amma'
UNION ALL
SELECT id, 'Ujian Tafsir Juz Amma', 'ujian', NULL, 'Evaluasi pemahaman tafsir juz amma.', 100, 100, 6 FROM courses WHERE slug = 'tafsir-juz-amma';

-- 5. RLS untuk tabel baru
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY lessons_select_all ON public.lessons FOR SELECT USING (TRUE);

CREATE POLICY lp_select_own ON public.lesson_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY lp_insert_own ON public.lesson_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY lp_update_own ON public.lesson_progress FOR UPDATE USING (user_id = auth.uid());
