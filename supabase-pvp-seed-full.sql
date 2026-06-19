-- ===============================================================
-- SUPABASE PVP SEED FULL
-- Create tables, RLS policies, and seed data for all 8 mapels
-- Each mapel: 20 tembak-soal + 20 kilat-menjawab + 20 tts + 20 correction = 80 rows
-- Total: 8 mapels × 80 = 640+ rows
-- ===============================================================

-- ===============================================================
-- 1. TABLES
-- ===============================================================

-- Tabel soal PVP untuk mode tembak-soal & kilat-menjawab
CREATE TABLE IF NOT EXISTS pvp_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mapel_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_option TEXT,
  difficulty TEXT DEFAULT 'medium',
  points INTEGER DEFAULT 10,
  time_limit_seconds INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel TTS (Teka Teki Silang) untuk mode teka-teki
CREATE TABLE IF NOT EXISTS pvp_tts_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mapel_id TEXT NOT NULL,
  clue TEXT NOT NULL,
  answer TEXT NOT NULL,
  points INTEGER DEFAULT 15
);

-- Tabel koreksi kalimat untuk mode koreksi
CREATE TABLE IF NOT EXISTS pvp_correction_sentences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mapel_id TEXT NOT NULL,
  wrong_sentence TEXT NOT NULL,
  correct_sentence TEXT NOT NULL,
  points INTEGER DEFAULT 20
);

-- ===============================================================
-- 2. RLS POLICIES
-- ===============================================================

ALTER TABLE pvp_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pvp_tts_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE pvp_correction_sentences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pvp_questions_select_all"
  ON pvp_questions FOR SELECT USING (true);

CREATE POLICY "pvp_tts_words_select_all"
  ON pvp_tts_words FOR SELECT USING (true);

CREATE POLICY "pvp_correction_sentences_select_all"
  ON pvp_correction_sentences FOR SELECT USING (true);

-- ===============================================================
-- 3. SEED DATA
-- ===============================================================

-- ===============================================================
-- MAPEL: aqidah-dasar
-- ===============================================================

-- TEMBAK SOAL (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, points, time_limit_seconds) VALUES
('aqidah-dasar', 'tembak-soal', 'Apa rukun iman yang pertama?', 'Iman kepada Allah', 'Iman kepada Malaikat', 'Iman kepada Kitab', 'Iman kepada Rasul', 'A', 'easy', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Ada berapa rukun iman?', '5', '6', '7', '4', 'B', 'easy', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Siapakah makhluk Allah yang pertama diciptakan?', 'Nabi Adam', 'Malaikat', 'Jin', 'Qalam', 'D', 'medium', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Apa nama malaikat yang bertugas meniup sangkakala?', 'Jibril', 'Mikail', 'Israfil', 'Izrail', 'C', 'medium', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Kitab suci yang diturunkan kepada Nabi Isa AS adalah?', 'Taurat', 'Zabur', 'Injil', 'Al-Quran', 'C', 'easy', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Rukun Islam yang ketiga adalah?', 'Shalat', 'Puasa', 'Zakat', 'Haji', 'B', 'easy', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Apa sifat wajib bagi Allah yang berarti "Ada"?', 'Qidam', 'Wujud', 'Baqa', 'Mukhalafatu lil hawadits', 'B', 'medium', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Nabi yang menerima kitab Taurat adalah?', 'Nabi Musa', 'Nabi Daud', 'Nabi Isa', 'Nabi Muhammad', 'A', 'easy', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Apa yang dimaksud dengan tauhid rububiyah?', 'Mengesakan Allah dalam ibadah', 'Mengesakan Allah dalam penciptaan', 'Mengesakan Allah dalam nama dan sifat', 'Mengesakan Allah dalam hukum', 'B', 'hard', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Malaikat yang bertugas mencatat amal baik adalah?', 'Jibril', 'Munkar', 'Raqib', 'Atid', 'C', 'medium', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Apa hukum orang yang murtad?', 'Wajib dibunuh', 'Diberi nasihat', 'Didiamkan', 'Dikeluarkan dari kampung', 'A', 'hard', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Sifat mustahil bagi Allah yang berarti "baru" adalah?', 'Adam', 'Huduts', 'Fana', 'Mumatsalah', 'B', 'medium', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Berapa jumlah malaikat yang wajib diketahui?', '5', '7', '10', '15', 'C', 'medium', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Hari kiamat disebut juga dengan?', 'Yaumul milad', 'Yaumul qiyamah', 'Yaumul mawlid', 'Yaumul jumah', 'B', 'easy', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Apa pengertian iman menurut Ahlussunnah?', 'Tasdiq bil qalb', 'Iqrar bil lisan', 'Amal bil arkan', 'Semua benar', 'D', 'medium', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Syirik terbagi menjadi berapa?', '1', '2', '3', '4', 'B', 'hard', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Iman kepada qada dan qadar adalah rukun iman ke?', '4', '5', '6', '7', 'C', 'medium', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Apa nama surga yang tertinggi?', 'Firdaus', 'Jannatun Naim', 'Maqam Ibrahim', 'Sidratul Muntaha', 'A', 'hard', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Malaikat Jibril juga dikenal dengan nama?', 'Ruh al-Qudus', 'Malik', 'Ridwan', 'Zabaniyah', 'A', 'medium', 10, 30),
('aqidah-dasar', 'tembak-soal', 'Apa arti "Ahlussunnah Wal Jamaah"?', 'Orang yang berilmu', 'Orang yang mengikuti sunnah dan jamaah', 'Orang yang bersatu', 'Orang yang shaleh', 'B', 'easy', 10, 30);

-- KILAT MENJAWAB (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, correct_option, difficulty, points, time_limit_seconds) VALUES
('aqidah-dasar', 'kilat-menjawab', 'Allah SWT memiliki sifat wajib Wujud yang artinya Ada.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Malaikat Mikail bertugas mencatat amal manusia.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Iman kepada kitab Allah adalah rukun iman keempat.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Rukun Islam ada 5.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Nabi Muhammad SAW adalah penutup para nabi.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Kitab Zabur diturunkan kepada Nabi Musa AS.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Iman itu mencakup keyakinan hati, ucapan lisan, dan amal perbuatan.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Allah SWT berada di mana-mana (hulul).', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Neraka Jahannam adalah tempat yang kekal bagi orang kafir.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Malaikat Izrail bertugas mencabut nyawa.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Syirik adalah dosa yang paling besar.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Tauhid uluhiyah berarti mengesakan Allah dalam rububiyah.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Hari akhir disebut juga Yaumul Hisab.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Malaikat itu diciptakan dari api.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Jin dan manusia diciptakan untuk beribadah kepada Allah.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Rasul yang termasuk Ulul Azmi ada 5.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Al-Quran adalah mukjizat terbesar Nabi Muhammad SAW.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Sifat maani Allah ada 7.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Hukum mempelajari tauhid adalah fardhu kifayah.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('aqidah-dasar', 'kilat-menjawab', 'Iman kepada takdir termasuk rukun iman keenam.', 'Benar', 'Salah', 'A', 'medium', 10, 30);

-- TTS WORDS (20)
INSERT INTO pvp_tts_words (mapel_id, clue, answer, points) VALUES
('aqidah-dasar', 'Rukun iman pertama', 'ALLAH', 15),
('aqidah-dasar', 'Malaikat penjaga pintu surga', 'RIDWAN', 15),
('aqidah-dasar', 'Kitab suci umat Islam', 'ALQURAN', 15),
('aqidah-dasar', 'Jumlah rukun iman', 'ENAM', 15),
('aqidah-dasar', 'Sifat Allah yang Maha Kekal', 'BAQA', 15),
('aqidah-dasar', 'Malaikat yang meniup sangkakala', 'ISRAFIL', 15),
('aqidah-dasar', 'Hari perhitungan amal', 'HISAB', 15),
('aqidah-dasar', 'Tempat kembali setelah mati', 'AKHIRAT', 15),
('aqidah-dasar', 'Iman kepada takdir disebut', 'QADAR', 15),
('aqidah-dasar', 'Pemimpin para nabi', 'MUHAMMAD', 15),
('aqidah-dasar', 'Surga tertinggi', 'FIRDAUS', 15),
('aqidah-dasar', 'Menyekutukan Allah disebut', 'SYIRIK', 15),
('aqidah-dasar', 'Malaikat pencatat amal buruk', 'ATID', 15),
('aqidah-dasar', 'Jumlah rukun Islam', 'LIMA', 15),
('aqidah-dasar', 'Puasa wajib di bulan', 'RAMADHAN', 15),
('aqidah-dasar', 'Nabi yang menerima kitab Zabur', 'DAUD', 15),
('aqidah-dasar', 'Malaikat pembagi rezeki', 'MIKAIL', 15),
('aqidah-dasar', 'Mengesakan Allah dalam ibadah', 'ULUHIYAH', 15),
('aqidah-dasar', 'Pintu neraka yang paling atas', 'HAWIAH', 15),
('aqidah-dasar', 'Rasul terakhir', 'MUHAMMAD', 15);

-- CORRECTION SENTENCES (20)
INSERT INTO pvp_correction_sentences (mapel_id, wrong_sentence, correct_sentence, points) VALUES
('aqidah-dasar', 'Allah itu baru diciptakan.', 'Allah itu Qadim (tidak ada awal).', 20),
('aqidah-dasar', 'Malaikat itu tidak patuh pada Allah.', 'Malaikat selalu patuh pada perintah Allah.', 20),
('aqidah-dasar', 'Rukun iman ada 5.', 'Rukun iman ada 6.', 20),
('aqidah-dasar', 'Kitab Taurat diturunkan kepada Nabi Isa.', 'Kitab Taurat diturunkan kepada Nabi Musa.', 20),
('aqidah-dasar', 'Hari kiamat disebut Yaumul Milad.', 'Hari kiamat disebut Yaumul Qiyamah.', 20),
('aqidah-dasar', 'Malaikat Jibril bertugas mencabut nyawa.', 'Malaikat Jibril bertugas menyampaikan wahyu.', 20),
('aqidah-dasar', 'Syirik adalah dosa kecil.', 'Syirik adalah dosa yang paling besar.', 20),
('aqidah-dasar', 'Rukun Islam yang pertama adalah shalat.', 'Rukun Islam yang pertama adalah syahadatain.', 20),
('aqidah-dasar', 'Nabi Muhammad adalah nabi biasa.', 'Nabi Muhammad adalah penutup para nabi.', 20),
('aqidah-dasar', 'Iman itu cukup dengan ucapan saja.', 'Iman itu mencakup hati, lisan, dan perbuatan.', 20),
('aqidah-dasar', 'Neraka itu tidak kekal bagi orang kafir.', 'Neraka itu kekal bagi orang kafir.', 20),
('aqidah-dasar', 'Malaikat diciptakan dari api.', 'Malaikat diciptakan dari cahaya (nur).', 20),
('aqidah-dasar', 'Allah mempunyai anak.', 'Allah Maha Suci, tidak beranak dan tidak diperanakkan.', 20),
('aqidah-dasar', 'Tauhid hanya terbagi satu macam.', 'Tauhid terbagi menjadi tiga: rububiyah, uluhiyah, asma wa sifat.', 20),
('aqidah-dasar', 'Hukum mempelajari tauhid adalah sunnah.', 'Hukum mempelajari tauhid adalah fardhu ain.', 20),
('aqidah-dasar', 'Semua agama sama benar.', 'Islam adalah agama yang benar di sisi Allah.', 20),
('aqidah-dasar', 'Surga dan neraka belum diciptakan.', 'Surga dan neraka sudah diciptakan dan kekal.', 20),
('aqidah-dasar', 'Manusia tidak mempunyai takdir.', 'Manusia mempunyai takdir yang sudah ditetapkan Allah.', 20),
('aqidah-dasar', 'Jibril adalah malaikat penjaga neraka.', 'Jibril adalah malaikat penyampai wahyu.', 20),
('aqidah-dasar', 'Hari baats berarti hari hisab.', 'Hari baats berarti hari kebangkitan dari kubur.', 20);

-- ===============================================================
-- MAPEL: nahwu-level-1
-- ===============================================================

-- TEMBAK SOAL (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, points, time_limit_seconds) VALUES
('nahwu-level-1', 'tembak-soal', 'Apa pengertian kalimat isim?', 'Kata kerja', 'Kata benda', 'Kata sambung', 'Kata depan', 'B', 'easy', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Fiil adalah kata yang menunjukkan?', 'Benda', 'Sifat', 'Pekerjaan atau peristiwa', 'Keterangan', 'C', 'easy', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Apa tanda isim yang paling utama?', 'Berakhiran nun', 'Bisa kemasukan alif lam', 'Bermimpi', 'Berwazan', 'B', 'medium', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Kalimat fiil terbagi menjadi berapa?', '2', '3', '4', '5', 'B', 'medium', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Apa yang dimaksud dengan marfuatul asma?', 'Isim yang dibaca kasrah', 'Isim yang dibaca fathah', 'Isim yang dibaca dhammah', 'Isim yang dibaca sukun', 'C', 'hard', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Apa contoh fiil madhi?', 'يَضْرِبُ', 'ضَرَبَ', 'لَنْ يَضْرِبَ', 'لَمْ يَضْرِبْ', 'B', 'medium', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Huruf jar menyebabkan isim menjadi?', 'Marfu', 'Manshub', 'Majrur', 'Mauquf', 'C', 'medium', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Apa tanda isim yang berupa tanwin?', 'ـًا', 'ـٍ', 'ـٌ', 'Semua benar', 'D', 'easy', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Apa itu faail?', 'Kata kerja', 'Subjek/pelaku', 'Objek', 'Keterangan', 'B', 'easy', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Fiil mudhari ditandai dengan?', 'Huruf mudharaah', 'Tanwin', 'Alif lam', 'Sukun', 'A', 'medium', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Apa yang dimaksud dengan maful bih?', 'Pelaku', 'Objek', 'Kata sifat', 'Kata keterangan', 'B', 'medium', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Huruf yang menasakhkan mubtada dan khabar adalah?', 'Huruf jar', 'Huruf athaf', 'Huruf nashikhah', 'Huruf qasam', 'C', 'hard', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Jumlah ismiyyah terdiri dari?', 'Fiil + fail', 'Mubtada + khabar', 'Fiil + maful', 'Huruf + isim', 'B', 'easy', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Jumlah fiiyah terdiri dari?', 'Fiil + fail', 'Mubtada + khabar', 'Isim + isim', 'Huruf + fiil', 'A', 'easy', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Apa tanda fiil madhi?', 'Bisa menerima ta ta-nits', 'Bisa menerima lam', 'Huruf mudharaah', 'Sukun', 'A', 'hard', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Mubtada harus dalam keadaan?', 'Marfu', 'Manshub', 'Majrur', 'Mauquf', 'A', 'medium', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Khabar adalah?', 'Kata kerja', 'Yang menerangkan mubtada', 'Pelaku', 'Objek', 'B', 'easy', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Apa itu naat?', 'Kata kerja', 'Sifat', 'Objek', 'Pelaku', 'B', 'medium', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Idhofah terdiri dari?', 'Mudhaf + mudhaf ilaih', 'Mubtada + khabar', 'Fiil + fail', 'Isim + fiil', 'A', 'medium', 10, 30),
('nahwu-level-1', 'tembak-soal', 'Mudhaf ilaih harus dibaca?', 'Fathah', 'Dhammah', 'Kasrah', 'Sukun', 'C', 'medium', 10, 30);

-- KILAT MENJAWAB (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, correct_option, difficulty, points, time_limit_seconds) VALUES
('nahwu-level-1', 'kilat-menjawab', 'Kalimat dalam bahasa Arab terbagi menjadi isim, fiil, dan huruf.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Isim adalah kata yang menunjukkan makna pekerjaan.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Fiil madhi menunjukkan waktu lampau.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Fail adalah objek dalam kalimat.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Jumlah ismiyyah diawali dengan isim.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Mubtada harus dibaca nashab.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Khabar adalah isim yang marfu.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Huruf jar menyebabkan isim menjadi manshub.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Fiil mudhari ditandai dengan huruf mudharaah.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Contoh fiil amar adalah "ifal".', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Maf ul bih adalah objek dari fiil.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Tanwin adalah tanda isim.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Alif lam adalah tanda fiil.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Naat adalah sifat yang mengikuti manutnya.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Idhofah terdiri dari mudhaf dan mudhaf ilaih.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Mudhaf ilaih harus dibaca dhammah.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Jumlah fiiyah dimulai dengan fiil.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Fiil madhi bisa menerima ta ta-nits.', 'Benar', 'Salah', 'A', 'hard', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Isim tafdhil menunjukkan kelebihan.', 'Benar', 'Salah', 'A', 'hard', 10, 30),
('nahwu-level-1', 'kilat-menjawab', 'Isim zaman adalah kata yang menunjukkan tempat.', 'Benar', 'Salah', 'B', 'hard', 10, 30);

-- TTS WORDS (20)
INSERT INTO pvp_tts_words (mapel_id, clue, answer, points) VALUES
('nahwu-level-1', 'Kata benda dalam bahasa Arab', 'ISIM', 15),
('nahwu-level-1', 'Kata kerja dalam bahasa Arab', 'FIIL', 15),
('nahwu-level-1', 'Subjek pelaku dalam kalimat', 'FAIL', 15),
('nahwu-level-1', 'Objek penderita dalam kalimat', 'MAFUL', 15),
('nahwu-level-1', 'Subjek dalam jumlah ismiyyah', 'MUBTADA', 15),
('nahwu-level-1', 'Predikat dalam jumlah ismiyyah', 'KHABAR', 15),
('nahwu-level-1', 'Kata sambung dalam bahasa Arab', 'HURUF', 15),
('nahwu-level-1', 'Kata sifat dalam bahasa Arab', 'NAAT', 15),
('nahwu-level-1', 'Kata kerja lampau', 'MADHI', 15),
('nahwu-level-1', 'Kata kerja sekarang/akan datang', 'MUDHARI', 15),
('nahwu-level-1', 'Kata kerja perintah', 'AMAR', 15),
('nahwu-level-1', 'Idhofah terdiri dari mudhaf dan', 'MUDHAFILAIH', 15),
('nahwu-level-1', 'Huruf yang menjazmkan fiil mudhari', 'JAZM', 15),
('nahwu-level-1', 'Tanda baca dhammah pada isim', 'MARFU', 15),
('nahwu-level-1', 'Tanda baca fathah pada isim', 'MANSHUB', 15),
('nahwu-level-1', 'Tanda baca kasrah pada isim', 'MAJRUR', 15),
('nahwu-level-1', 'Isim yang menunjukkan waktu', 'ZAMAN', 15),
('nahwu-level-1', 'Isim yang menunjukkan tempat', 'MAKAN', 15),
('nahwu-level-1', 'Kalimat yang diawali isim', 'ISMIYYAH', 15),
('nahwu-level-1', 'Kalimat yang diawali fiil', 'FIILIYAH', 15);

-- CORRECTION SENTENCES (20)
INSERT INTO pvp_correction_sentences (mapel_id, wrong_sentence, correct_sentence, points) VALUES
('nahwu-level-1', 'Isim adalah kata kerja.', 'Isim adalah kata benda.', 20),
('nahwu-level-1', 'Fiil menunjukkan waktu diam.', 'Fiil menunjukkan pekerjaan atau peristiwa.', 20),
('nahwu-level-1', 'Jumlah ismiyyah diawali dengan fiil.', 'Jumlah ismiyyah diawali dengan isim.', 20),
('nahwu-level-1', 'Fail adalah objek.', 'Fail adalah subjek atau pelaku.', 20),
('nahwu-level-1', 'Huruf jar menyebabkan isim dibaca dhammah.', 'Huruf jar menyebabkan isim dibaca kasrah (majrur).', 20),
('nahwu-level-1', 'Mubtada harus dibaca nashab.', 'Mubtada harus dibaca marfu (dhammah).', 20),
('nahwu-level-1', 'Khabar adalah isim yang manshub.', 'Khabar adalah isim yang marfu.', 20),
('nahwu-level-1', 'Fiil madhi ditandai dengan huruf mudharaah.', 'Fiil mudhari ditandai dengan huruf mudharaah.', 20),
('nahwu-level-1', 'Kalimat dalam Arab terbagi 2.', 'Kalimat dalam Arab terbagi 3: isim, fiil, huruf.', 20),
('nahwu-level-1', 'Naat adalah maful.', 'Naat adalah sifat yang mengikuti manutnya.', 20),
('nahwu-level-1', 'Mudhaf ilaih dibaca dhammah.', 'Mudhaf ilaih dibaca kasrah.', 20),
('nahwu-level-1', 'Fiil amar adalah fiil lampau.', 'Fiil amar adalah fiil perintah.', 20),
('nahwu-level-1', 'Jumlah fiiyah dimulai dengan isim.', 'Jumlah fiiyah dimulai dengan fiil.', 20),
('nahwu-level-1', 'Alif lam adalah tanda fiil.', 'Alif lam adalah tanda isim.', 20),
('nahwu-level-1', 'Tanwin adalah tanda fiil.', 'Tanwin adalah tanda isim.', 20),
('nahwu-level-1', 'Maf ul bih adalah pelaku.', 'Maf ul bih adalah objek.', 20),
('nahwu-level-1', 'Isim zaman menunjukkan tempat.', 'Isim zaman menunjukkan waktu.', 20),
('nahwu-level-1', 'Huruf athaf menghubungkan isim saja.', 'Huruf athaf menghubungkan isim dan fiil.', 20),
('nahwu-level-1', 'Idhofah terdiri dari tiga bagian.', 'Idhofah terdiri dari dua bagian: mudhaf dan mudhaf ilaih.', 20),
('nahwu-level-1', 'Mubtada harus berupa fiil.', 'Mubtada harus berupa isim.', 20);

-- ===============================================================
-- MAPEL: shorof-level-1
-- ===============================================================

-- TEMBAK SOAL (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, points, time_limit_seconds) VALUES
('shorof-level-1', 'tembak-soal', 'Apa pengertian shorof?', 'Ilmu tentang makna kata', 'Ilmu tentang perubahan bentuk kata', 'Ilmu tentang tata bahasa', 'Ilmu tentang balaghah', 'B', 'easy', 10, 30),
('shorof-level-1', 'tembak-soal', 'Apa wazan untuk fiil madhi?', 'يَفْعَلُ', 'فَعَلَ', 'اِفْعَلْ', 'لَمْ يَفْعَلْ', 'B', 'medium', 10, 30),
('shorof-level-1', 'tembak-soal', 'Berapa jumlah huruf dalam fiil tsulatsi?', '2', '3', '4', '5', 'B', 'medium', 10, 30),
('shorof-level-1', 'tembak-soal', 'Fiil tsulatsi mujarrad adalah?', 'Fiil 3 huruf dengan tambahan', 'Fiil 3 huruf tanpa tambahan', 'Fiil 4 huruf', 'Fiil 5 huruf', 'B', 'hard', 10, 30),
('shorof-level-1', 'tembak-soal', 'Apa wazan fiil mudhari untuk فَعَلَ?', 'يَفْعِلُ', 'يَفْعُلُ', 'يَفْعَلُ', 'Semua bisa', 'D', 'hard', 10, 30),
('shorof-level-1', 'tembak-soal', 'Mashdar dari فَعَلَ adalah?', 'فِعْلَة', 'فُعُوْل', 'فَعْل', 'مَفْعَل', 'C', 'medium', 10, 30),
('shorof-level-1', 'tembak-soal', 'Apa wazan isim fail?', 'مَفْعُوْل', 'فَاعِل', 'فَعِيْل', 'مِفْعَال', 'B', 'medium', 10, 30),
('shorof-level-1', 'tembak-soal', 'Apa wazan isim maful?', 'فَاعِل', 'مَفْعُوْل', 'فَعِيْل', 'فَعُوْل', 'B', 'medium', 10, 30),
('shorof-level-1', 'tembak-soal', 'Fiil rubai terdiri dari berapa huruf?', '3', '4', '5', '6', 'B', 'medium', 10, 30),
('shorof-level-1', 'tembak-soal', 'Apa contoh fiil rubai?', 'ضَرَبَ', 'دَحْرَجَ', 'أَكْرَمَ', 'اِنْطَلَقَ', 'B', 'hard', 10, 30),
('shorof-level-1', 'tembak-soal', 'Apa wazan fiil amar?', 'يَفْعَلُ', 'فَعَلَ', 'اُفْعُلْ', 'لَمْ يَفْعَلْ', 'C', 'medium', 10, 30),
('shorof-level-1', 'tembak-soal', 'Isim zaman dan isim makan memiliki wazan?', 'مَفْعَلَة', 'مَفْعَل', 'مِفْعَال', 'فَعَّال', 'B', 'hard', 10, 30),
('shorof-level-1', 'tembak-soal', 'Apa wazan isim alat?', 'مِفْعَال', 'مَفْعَل', 'فَاعِل', 'فَعِيْل', 'A', 'hard', 10, 30),
('shorof-level-1', 'tembak-soal', 'Tasrif adalah?', 'Perubahan kata berdasarkan waktu dan pelaku', 'Susunan kalimat', 'Irab', 'Makna kata', 'A', 'easy', 10, 30),
('shorof-level-1', 'tembak-soal', 'Apa huruf tambahan dalam fiil tsulatsi mazid?', 'أ ن ت', 'أ ن', 'س أ ل', 'ف ع ل', 'A', 'hard', 10, 30),
('shorof-level-1', 'tembak-soal', 'Wazan اِنْفَعَلَ menunjukkan makna?', 'Berlebih-lebihan', 'Saling', 'Pasif', 'Meminta', 'C', 'hard', 10, 30),
('shorof-level-1', 'tembak-soal', 'Apa wazan untuk fiil mudhari muannats?', 'تَفْعَلُ', 'يَفْعَلُ', 'نَفْعَلُ', 'أَفْعَلُ', 'A', 'medium', 10, 30),
('shorof-level-1', 'tembak-soal', 'Isim tafdhil memiliki wazan?', 'فَاعِل', 'أَفْعَل', 'مَفْعَل', 'فِعِّيل', 'B', 'hard', 10, 30),
('shorof-level-1', 'tembak-soal', 'Fiil nahi menggunakan?', 'لَمْ + fiil mudhari', 'لَا + fiil amar', 'لَا + fiil mudhari', 'لَنْ + fiil mudhari', 'C', 'medium', 10, 30),
('shorof-level-1', 'tembak-soal', 'Apa shighat untuk kata ganti "kami"?', 'أَنَا', 'نَحْنُ', 'أَنْتَ', 'هُوَ', 'B', 'easy', 10, 30);

-- KILAT MENJAWAB (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, correct_option, difficulty, points, time_limit_seconds) VALUES
('shorof-level-1', 'kilat-menjawab', 'Shorof adalah ilmu tentang perubahan bentuk kata.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Fiil tsulatsi terdiri dari 4 huruf.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Wazan fiil madhi adalah فَعَلَ.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Isim fail memiliki wazan فَاعِل.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Isim maf ul memiliki wazan فَاعِل.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Fiil amar wazannya اُفْعُلْ.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Mashdar adalah kata kerja.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Fiil rubai terdiri dari 5 huruf.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Contoh fiil rubai adalah دَحْرَجَ.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Isim zaman menunjukkan tempat.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Wazan مَفْعَل untuk isim zaman dan isim makan.', 'Benar', 'Salah', 'A', 'hard', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Isim alat memiliki wazan مِفْعَال.', 'Benar', 'Salah', 'A', 'hard', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Fiil nahi didahului dengan لَنْ.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Wazan أَفْعَل adalah wazan isim tafdhil.', 'Benar', 'Salah', 'A', 'hard', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Tasrif laghawi adalah perubahan bentuk kata.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Fiil tsulatsi mazid adalah fiil 3 huruf tanpa tambahan.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Wazan نَحْنُ untuk kata ganti kami.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Fiil mudhari muannats menggunakan huruf ت.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Isim tafdhil menunjukkan makna berlebih.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('shorof-level-1', 'kilat-menjawab', 'Mashdar ghairu qiyasi adalah mashdar yang tidak teratur.', 'Benar', 'Salah', 'A', 'hard', 10, 30);

-- TTS WORDS (20)
INSERT INTO pvp_tts_words (mapel_id, clue, answer, points) VALUES
('shorof-level-1', 'Ilmu perubahan bentuk kata', 'SHOROF', 15),
('shorof-level-1', 'Wazan fiil madhi', 'FAALA', 15),
('shorof-level-1', 'Kata kerja lampau', 'MADHI', 15),
('shorof-level-1', 'Kata kerja sekarang', 'MUDHARI', 15),
('shorof-level-1', 'Kata kerja perintah', 'AMAR', 15),
('shorof-level-1', 'Pelaku dalam wazan فَاعِل', 'FAIL', 15),
('shorof-level-1', 'Objek dalam wazan مَفْعُوْل', 'MAFUL', 15),
('shorof-level-1', 'Kata dasar dalam shorof', 'MASHDAR', 15),
('shorof-level-1', 'Fiil 3 huruf', 'TSULATSI', 15),
('shorof-level-1', 'Fiil 4 huruf', 'RUBAI', 15),
('shorof-level-1', 'Kata ganti dalam shorof', 'DHAMIR', 15),
('shorof-level-1', 'Wazan isim tafdhil', 'AFAL', 15),
('shorof-level-1', 'Wazan isim alat', 'MIFAL', 15),
('shorof-level-1', 'Perubahan kata sesuai pola', 'TASRIF', 15),
('shorof-level-1', 'Kata ganti saya', 'ANA', 15),
('shorof-level-1', 'Kata ganti kamu laki-laki', 'ANTA', 15),
('shorof-level-1', 'Kata ganti dia laki-laki', 'HUWA', 15),
('shorof-level-1', 'Kata ganti dia perempuan', 'HIYA', 15),
('shorof-level-1', 'Kata ganti kami', 'NAHNU', 15),
('shorof-level-1', 'Kata ganti mereka laki-laki', 'HUM', 15);

-- CORRECTION SENTENCES (20)
INSERT INTO pvp_correction_sentences (mapel_id, wrong_sentence, correct_sentence, points) VALUES
('shorof-level-1', 'Shorof adalah ilmu tentang makna kata.', 'Shorof adalah ilmu tentang perubahan bentuk kata.', 20),
('shorof-level-1', 'Fiil tsulatsi terdiri dari 4 huruf.', 'Fiil tsulatsi terdiri dari 3 huruf.', 20),
('shorof-level-1', 'Wazan fiil mudhari adalah فَعَلَ.', 'Wazan fiil madhi adalah فَعَلَ.', 20),
('shorof-level-1', 'Isim maf ul wazannya فَاعِل.', 'Isim maf ul wazannya مَفْعُوْل.', 20),
('shorof-level-1', 'Mashdar adalah kata sifat.', 'Mashdar adalah kata dasar (verbal noun).', 20),
('shorof-level-1', 'Fiil amar wazannya يَفْعَلُ.', 'Fiil amar wazannya اُفْعُلْ.', 20),
('shorof-level-1', 'Fiil rubai terdiri dari 3 huruf.', 'Fiil rubai terdiri dari 4 huruf.', 20),
('shorof-level-1', 'Fiil nahi didahului لَنْ.', 'Fiil nahi didahului لَا.', 20),
('shorof-level-1', 'Isim zaman menunjukkan tempat.', 'Isim zaman menunjukkan waktu.', 20),
('shorof-level-1', 'Wazan isim alat adalah فَاعِل.', 'Wazan isim alat adalah مِفْعَال.', 20),
('shorof-level-1', 'Fiil tsulatsi mazid adalah fiil 3 huruf tanpa tambahan.', 'Fiil tsulatsi mujarrad adalah fiil 3 huruf tanpa tambahan.', 20),
('shorof-level-1', 'Tasrif tidak ada hubungan dengan shorof.', 'Tasrif adalah inti dari ilmu shorof.', 20),
('shorof-level-1', 'Isim tafdhil wazannya فَاعِل.', 'Isim tafdhil wazannya أَفْعَل.', 20),
('shorof-level-1', 'Dhamir adalah kata keterangan.', 'Dhamir adalah kata ganti.', 20),
('shorof-level-1', 'Wazan اِنْفَعَلَ bermakna aktif.', 'Wazan اِنْفَعَلَ bermakna pasif.', 20),
('shorof-level-1', 'Fiil mudhari untuk perempuan menggunakan ي.', 'Fiil mudhari untuk perempuan menggunakan ت.', 20),
('shorof-level-1', 'نَحْنُ artinya saya.', 'نَحْنُ artinya kami.', 20),
('shorof-level-1', 'Isim alat menunjukkan pelaku.', 'Isim alat menunjukkan alat.', 20),
('shorof-level-1', 'مَفْعَل adalah wazan isim fail.', 'مَفْعَل adalah wazan isim zaman dan isim makan.', 20),
('shorof-level-1', 'Shorof dan nahwu adalah ilmu yang sama.', 'Shorof dan nahwu adalah dua ilmu yang berbeda.', 20);

-- ===============================================================
-- MAPEL: fiqh-ibadah
-- ===============================================================

-- TEMBAK SOAL (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, points, time_limit_seconds) VALUES
('fiqh-ibadah', 'tembak-soal', 'Apa rukun shalat yang pertama?', 'Takbiratul ihram', 'Berdiri', 'Niat', 'Membaca Fatihah', 'C', 'medium', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Ada berapa rukun wudhu?', '4', '5', '6', '7', 'C', 'medium', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Apa yang membatalkan wudhu?', 'Makan', 'Tidur', 'Berdiri', 'Melihat', 'B', 'easy', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Shalat fardhu yang jumlah rakaatnya 3 adalah?', 'Maghrib', 'Isya', 'Subuh', 'Dhuhur', 'A', 'easy', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Hukum puasa Ramadhan adalah?', 'Sunnah', 'Wajib', 'Mubah', 'Makruh', 'B', 'easy', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Apa saja yang termasuk najis?', 'Darah', 'Air', 'Susu', 'Madu', 'A', 'easy', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Hadats besar disucikan dengan?', 'Wudhu', 'Tayammum', 'Mandi wajib', 'Istinja', 'C', 'medium', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Tayammum dilakukan ketika?', 'Ada air', 'Tidak ada air atau sakit', 'Setelah shalat', ' sebelum tidur', 'B', 'easy', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Nisab zakat emas adalah?', '70 gram', '85 gram', '100 gram', '120 gram', 'B', 'hard', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Rukun haji yang paling utama adalah?', 'Sa\'i', 'Wukuf di Arafah', 'Tawaf', 'Lempar jumrah', 'B', 'medium', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Shalat sunnah yang dikerjakan sebelum subuh disebut?', 'Dhuha', 'Tahajud', 'Qabliyah subuh', 'Ba\'diyah subuh', 'C', 'medium', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Air yang suci dan mensucikan disebut?', 'Air mutanajjis', 'Air mustamal', 'Air mutlak', 'Air musyammas', 'C', 'medium', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Hadats kecil disucikan dengan?', 'Mandi', 'Wudhu', 'Tayammum', 'Istinja', 'B', 'easy', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Zakat fitrah dibayarkan berupa?', 'Uang', 'Makanan pokok', 'Pakaian', 'Emas', 'B', 'easy', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Shalat witir adalah shalat sunnah yang jumlah rakaatnya?', '1-3', '4-6', '7-9', '10-12', 'A', 'medium', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Sujud tilawah dilakukan ketika?', ' mendengar adzan', 'Membaca ayat sajdah', 'Shalat', 'Berdoa', 'B', 'medium', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Apa hukum menuntut ilmu?', 'Sunnah', 'Wajib', 'Mubah', 'Makruh', 'B', 'medium', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Puasa sunnah Senin Kamis hukumnya?', 'Wajib', 'Sunnah', 'Makruh', 'Haram', 'B', 'easy', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Tawaf yang dilakukan ketika datang ke Mekah adalah?', 'Tawaf ifadhah', 'Tawaf qudum', 'Tawaf wada', 'Tawaf sunnah', 'B', 'hard', 10, 30),
('fiqh-ibadah', 'tembak-soal', 'Batas aurat laki-laki dalam shalat adalah?', 'Dada sampai lutut', 'Pusar sampai lutut', 'Seluruh tubuh', 'Dada sampai perut', 'B', 'medium', 10, 30);

-- KILAT MENJAWAB (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, correct_option, difficulty, points, time_limit_seconds) VALUES
('fiqh-ibadah', 'kilat-menjawab', 'Shalat fardhu 5 waktu hukumnya wajib.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Wudhu cukup membasuh muka dan tangan saja.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Air mutlak adalah air yang suci dan mensucikan.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Tayammum menggunakan tanah yang bersih.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Mandi wajib hanya untuk perempuan.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Hukum puasa Ramadhan adalah sunnah.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Zakat fitrah dibayarkan saat Idul Adha.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Rukun shalat ada 13 menurut mazhab Syafii.', 'Benar', 'Salah', 'A', 'hard', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Niat shalat tempatnya di hati.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Shalat subuh berjumlah 3 rakaat.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Wukuf di Arafah termasuk rukun haji.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Bersiwak hukumnya wajib sebelum shalat.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Najis dapat dibagi menjadi 3 macam.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Air mustamal adalah air bekas wudhu.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Shalat Jumat hukumnya wajib bagi perempuan.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Puasa sunnah Ayyamul Bidh adalah tanggal 13,14,15.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Batas aurat perempuan adalah seluruh tubuh kecuali muka dan telapak tangan.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Membaca Al-Fatihah termasuk sunnah shalat.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Sujud sahwi dilakukan karena lupa dalam shalat.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('fiqh-ibadah', 'kilat-menjawab', 'Haji wajib dilakukan sekali seumur hidup.', 'Benar', 'Salah', 'A', 'easy', 10, 30);

-- TTS WORDS (20)
INSERT INTO pvp_tts_words (mapel_id, clue, answer, points) VALUES
('fiqh-ibadah', 'Rukun Islam kedua', 'SHALAT', 15),
('fiqh-ibadah', 'Membersihkan hadats kecil', 'WUDHU', 15),
('fiqh-ibadah', 'Pengganti wudhu tanpa air', 'TAYAMMUM', 15),
('fiqh-ibadah', 'Mandi untuk menghilangkan hadats besar', 'JANABAH', 15),
('fiqh-ibadah', 'Shalat malam', 'TAHAJUD', 15),
('fiqh-ibadah', 'Shalat tengah malam sebelum subuh', 'WITIR', 15),
('fiqh-ibadah', 'Shalat sunnah pagi hari', 'DHUHA', 15),
('fiqh-ibadah', 'Rukun Islam keempat', 'PUASA', 15),
('fiqh-ibadah', 'Bulan puasa', 'RAMADHAN', 15),
('fiqh-ibadah', 'Harta yang wajib dikeluarkan', 'ZAKAT', 15),
('fiqh-ibadah', 'Rukun Islam kelima', 'HAJI', 15),
('fiqh-ibadah', 'Kain ihram untuk haji', 'IHRAM', 15),
('fiqh-ibadah', 'Berjalan antara Shafa dan Marwah', 'SAI', 15),
('fiqh-ibadah', 'Mengelilingi Ka bah', 'TAWAF', 15),
('fiqh-ibadah', 'Berdiri di Arafah', 'WUKUF', 15),
('fiqh-ibadah', 'Air yang suci dan mensucikan', 'MUTLAK', 15),
('fiqh-ibadah', 'Air bekas wudhu', 'MUSTAMAL', 15),
('fiqh-ibadah', 'Benda najis', 'NAJIS', 15),
('fiqh-ibadah', 'Membersihkan najis', 'ISTINJA', 15),
('fiqh-ibadah', 'Shalat sunnah rawatib sebelum', 'QABLIYAH', 15);

-- CORRECTION SENTENCES (20)
INSERT INTO pvp_correction_sentences (mapel_id, wrong_sentence, correct_sentence, points) VALUES
('fiqh-ibadah', 'Wudhu cukup membasuh muka saja.', 'Wudhu memiliki 6 rukun termasuk membasuh muka, tangan, kepala, dan kaki.', 20),
('fiqh-ibadah', 'Puasa Ramadhan hukumnya sunnah.', 'Puasa Ramadhan hukumnya wajib.', 20),
('fiqh-ibadah', 'Shalat subuh jumlahnya 3 rakaat.', 'Shalat subuh jumlahnya 2 rakaat.', 20),
('fiqh-ibadah', 'Mandi wajib hanya untuk laki-laki.', 'Mandi wajib untuk laki-laki dan perempuan yang berhadats besar.', 20),
('fiqh-ibadah', 'Air mustamal adalah air suci dan mensucikan.', 'Air mustamal adalah air suci tetapi tidak mensucikan.', 20),
('fiqh-ibadah', 'Tayammum menggunakan air.', 'Tayammum menggunakan tanah yang bersih.', 20),
('fiqh-ibadah', 'Zakat fitrah dibayarkan saat Idul Adha.', 'Zakat fitrah dibayarkan sebelum Idul Fitri.', 20),
('fiqh-ibadah', 'Shalat Jumat wajib bagi semua muslim.', 'Shalat Jumat wajib bagi laki-laki muslim.', 20),
('fiqh-ibadah', 'Niat shalat diucapkan dengan lisan.', 'Niat shalat cukup dalam hati.', 20),
('fiqh-ibadah', 'Haji wajib setiap tahun.', 'Haji wajib sekali seumur hidup bagi yang mampu.', 20),
('fiqh-ibadah', 'Tawaf ifadhah dilakukan saat datang ke Mekah.', 'Tawaf qudum dilakukan saat datang ke Mekah.', 20),
('fiqh-ibadah', 'Membaca Al-Fatihah adalah sunnah shalat.', 'Membaca Al-Fatihah adalah rukun shalat.', 20),
('fiqh-ibadah', 'Wukuf di Muzdalifah termasuk rukun haji.', 'Wukuf di Arafah termasuk rukun haji.', 20),
('fiqh-ibadah', 'Sa\'i adalah mengelilingi Ka\'bah.', 'Sa\'i adalah berjalan antara Shafa dan Marwah.', 20),
('fiqh-ibadah', 'Puasa sunnah dilarang pada hari Jumat.', 'Puasa sunnah dilarang pada hari Syak (ragu-ragu).', 20),
('fiqh-ibadah', 'Batas aurat laki-laki dari dada sampai lutut.', 'Batas aurat laki-laki dari pusar sampai lutut.', 20),
('fiqh-ibadah', 'Sujud tilawah dilakukan saat shalat saja.', 'Sujud tilawah dilakukan ketika membaca/mendengar ayat sajdah.', 20),
('fiqh-ibadah', 'Shalat dhuha dikerjakan setelah subuh.', 'Shalat dhuha dikerjakan setelah matahari terbit.', 20),
('fiqh-ibadah', 'Bersiwak hukumnya wajib.', 'Bersiwak hukumnya sunnah.', 20),
('fiqh-ibadah', 'Air mutanajjis adalah air suci.', 'Air mutanajjis adalah air yang terkena najis.', 20);

-- ===============================================================
-- MAPEL: tajwid-tahsin
-- ===============================================================

-- TEMBAK SOAL (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, points, time_limit_seconds) VALUES
('tajwid-tahsin', 'tembak-soal', 'Apa hukum membaca Al-Quran dengan tajwid?', 'Sunnah', 'Wajib', 'Mubah', 'Makruh', 'B', 'easy', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Berapa jumlah huruf hijaiyah?', '28', '29', '30', '27', 'B', 'easy', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Apa pengertian idzhar?', 'Melebur huruf', 'Jelas membaca huruf', 'Menyembunyikan huruf', 'Memantulkan huruf', 'B', 'medium', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Hukum nun mati bertemu huruf ba adalah?', 'Idzhar', 'Ikhfa', 'Idgham bighunnah', 'Iqlab', 'D', 'medium', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Ghunnah adalah?', 'Membaca jelas', 'Membaca dengung', 'Membaca panjang', 'Membaca pendek', 'B', 'easy', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Mad thabii panjangnya berapa harakat?', '1', '2', '3', '4', 'B', 'easy', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Hukum bacaan ra tafkhim adalah?', 'Tipis', 'Tebal', 'Sedang', 'Dengung', 'B', 'medium', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Mad wajib muttasil panjangnya?', '2 harakat', '4 harakat', '4-5 harakat', '6 harakat', 'C', 'hard', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Lam jalalah dibaca tafkhim jika sebelumnya?', 'Kasrah', 'Fathah atau dhammah', 'Sukun', 'Tanwin', 'B', 'medium', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Qalqalah sugra terjadi ketika huruf qalqalah?', 'Di awal kata', 'Di tengah dan bersukun', 'Di akhir kata', 'Di awal kalimat', 'B', 'hard', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Idgham bighunnah terjadi pada huruf?', 'ي - ن - م - و', 'ب - ج - د - ط', 'ر - ز - س - ش', 'ا - د - ذ - ر', 'A', 'medium', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Apa itu waqaf?', 'Memulai bacaan', 'Berhenti pada bacaan', 'Mempercepat bacaan', 'Mengulang bacaan', 'B', 'easy', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Huruf ikhfa ada berapa?', '10', '12', '15', '20', 'C', 'hard', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Mad arid lissukun panjangnya?', '2 harakat', '4 harakat', '2-6 harakat', '6 harakat', 'C', 'hard', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Apa yang dimaksud dengan makharijul huruf?', 'Sifat huruf', 'Tempat keluar huruf', 'Hukum bacaan', 'Panjang pendek bacaan', 'B', 'medium', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Hukum mim mati bertemu mim adalah?', 'Idzhar syafawi', 'Ikhfa syafawi', 'Idgham mimi', 'Iqlab', 'C', 'medium', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Sifat huruf hams artinya?', 'Keras', 'Lemah/berdesis', 'Tinggi', 'Rendah', 'B', 'hard', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Waqaf jaiz artinya?', 'Wajib berhenti', 'Boleh berhenti', 'Dilarang berhenti', 'Sunnah berhenti', 'B', 'medium', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Huruf isti la adalah huruf yang?', 'Tipis', 'Tebal', 'Dengung', 'Panjang', 'B', 'hard', 10, 30),
('tajwid-tahsin', 'tembak-soal', 'Madd far i adalah?', 'Mad asli', 'Mad tambahan karena sebab tertentu', 'Mad pengganti', 'Mad wajib', 'B', 'medium', 10, 30);

-- KILAT MENJAWAB (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, correct_option, difficulty, points, time_limit_seconds) VALUES
('tajwid-tahsin', 'kilat-menjawab', 'Hukum mempelajari tajwid adalah fardhu kifayah.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Membaca Al-Quran dengan tajwid hukumnya wajib.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Mad thabii panjangnya 2 harakat.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Idgham bighunnah terjadi tanpa dengung.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Ghunnah adalah bunyi dengung.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Iqlab berarti mengganti nun mati menjadi mim.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Qalqalah kubra terjadi di tengah ayat.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Lam jalalah dibaca tarqiq jika didahului kasrah.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Mad jaiz munfasil panjangnya 4-5 harakat.', 'Benar', 'Salah', 'A', 'hard', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Mad wajib muttasil panjangnya 2 harakat.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Ikhfa terjadi pada nun mati bertemu 15 huruf.', 'Benar', 'Salah', 'A', 'hard', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Ra dibaca tafkhim jika berharakat kasrah.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Waqaf artinya berhenti.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Sifat jahr artinya bacaan berdesis.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Mim mati bertemu mim hukumnya idgham mimi.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Makharijul huruf mempelajari panjang pendek.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Huruf hijaiyah berjumlah 30.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Mad badal termasuk mad far\'i.', 'Benar', 'Salah', 'A', 'hard', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Sifat huruf ada 17.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('tajwid-tahsin', 'kilat-menjawab', 'Idzhar berarti melebur huruf.', 'Benar', 'Salah', 'B', 'medium', 10, 30);

-- TTS WORDS (20)
INSERT INTO pvp_tts_words (mapel_id, clue, answer, points) VALUES
('tajwid-tahsin', 'Ilmu cara membaca Al-Quran', 'TAJWID', 15),
('tajwid-tahsin', 'Bunyi dengung dalam tajwid', 'GHUNNAH', 15),
('tajwid-tahsin', 'Jelas membaca huruf nun mati', 'IDZHAR', 15),
('tajwid-tahsin', 'Melebur nun mati ke huruf berikutnya', 'IDGHAM', 15),
('tajwid-tahsin', 'Menukar nun mati menjadi mim', 'IQLAB', 15),
('tajwid-tahsin', 'Menyembunyikan nun mati', 'IKHFA', 15),
('tajwid-tahsin', 'Panjang bacaan 2 harakat', 'MADTHABII', 15),
('tajwid-tahsin', 'Mad karena bertemu hamzah dalam kata', 'WAJIBMUTTASIL', 15),
('tajwid-tahsin', 'Mad karena bertemu hamzah lain kata', 'JAIZMUNFASIL', 15),
('tajwid-tahsin', 'Mad karena berhenti di akhir ayat', 'ARIDLISSUKUN', 15),
('tajwid-tahsin', 'Bacaan tebal pada lam Allah', 'TAFKHIM', 15),
('tajwid-tahsin', 'Bacaan tipis pada lam Allah', 'TARQIQ', 15),
('tajwid-tahsin', 'Memantulkan huruf', 'QALQALAH', 15),
('tajwid-tahsin', 'Berhenti pada bacaan', 'WAQAF', 15),
('tajwid-tahsin', 'Tempat keluar huruf', 'MAKHARIJ', 15),
('tajwid-tahsin', 'Hukum mim mati bertemu mim', 'IDGHAMMIMI', 15),
('tajwid-tahsin', 'Hukum mim mati bertemu ba', 'IKHFASYAFawi', 15),
('tajwid-tahsin', 'Bacaan tebal pada huruf ra', 'TAFKHIM', 15),
('tajwid-tahsin', 'Sifat huruf lemah/berdesis', 'HAMS', 15),
('tajwid-tahsin', 'Sifat huruf keras', 'JAHR', 15);

-- CORRECTION SENTENCES (20)
INSERT INTO pvp_correction_sentences (mapel_id, wrong_sentence, correct_sentence, points) VALUES
('tajwid-tahsin', 'Hukum mempelajari tajwid adalah fardhu kifayah.', 'Hukum mempraktikkan tajwid saat membaca Al-Quran adalah fardhu ain.', 20),
('tajwid-tahsin', 'Mad thabii panjangnya 4 harakat.', 'Mad thabii panjangnya 2 harakat.', 20),
('tajwid-tahsin', 'Idgham bighunnah dibaca tanpa dengung.', 'Idgham bighunnah dibaca dengan dengung.', 20),
('tajwid-tahsin', 'Huruf hijaiyah berjumlah 28.', 'Huruf hijaiyah berjumlah 29.', 20),
('tajwid-tahsin', 'Iqlab tidak mengganti nun mati menjadi mim.', 'Iqlab mengganti nun mati atau tanwin menjadi mim.', 20),
('tajwid-tahsin', 'Qalqalah sugra terjadi di akhir kata.', 'Qalqalah sugra terjadi di tengah kata.', 20),
('tajwid-tahsin', 'Ra tafkhim dibaca tipis.', 'Ra tafkhim dibaca tebal.', 20),
('tajwid-tahsin', 'Lam jalalah dibaca tafkhim jika sebelumnya kasrah.', 'Lam jalalah dibaca tarqiq jika sebelumnya kasrah.', 20),
('tajwid-tahsin', 'Mad wajib muttasil panjangnya 2 harakat.', 'Mad wajib muttasil panjangnya 4-5 harakat.', 20),
('tajwid-tahsin', 'Ikhfa terjadi dengan 10 huruf.', 'Ikhfa terjadi dengan 15 huruf.', 20),
('tajwid-tahsin', 'Ghunnah adalah bunyi panjang.', 'Ghunnah adalah bunyi dengung.', 20),
('tajwid-tahsin', 'Mad jaiz munfasil panjangnya 2 harakat.', 'Mad jaiz munfasil panjangnya 4-5 harakat.', 20),
('tajwid-tahsin', 'Waqaf artinya melanjutkan bacaan.', 'Waqaf artinya berhenti pada bacaan.', 20),
('tajwid-tahsin', 'Sifat jahr artinya bacaan berdesis.', 'Sifat jahr artinya bacaan jelas/keras.', 20),
('tajwid-tahsin', 'Hams artinya bacaan keras.', 'Hams artinya bacaan lemah/berdesis.', 20),
('tajwid-tahsin', 'Idzhar berarti melebur huruf.', 'Idzhar berarti membaca jelas huruf nun mati atau tanwin.', 20),
('tajwid-tahsin', 'Makharijul huruf adalah hukum bacaan.', 'Makharijul huruf adalah tempat keluar huruf.', 20),
('tajwid-tahsin', 'Mad arid lissukun panjangnya tetap 2 harakat.', 'Mad arid lissukun panjangnya boleh 2, 4, atau 6 harakat.', 20),
('tajwid-tahsin', 'Hukum mim mati bertemu mim adalah ikhfa syafawi.', 'Hukum mim mati bertemu mim adalah idgham mimi.', 20),
('tajwid-tahsin', 'Sifat isti la berarti bacaan tipis.', 'Sifat isti la berarti bacaan tebal.', 20);

-- ===============================================================
-- MAPEL: adab-akhlaq
-- ===============================================================

-- TEMBAK SOAL (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, points, time_limit_seconds) VALUES
('adab-akhlaq', 'tembak-soal', 'Apa yang dimaksud dengan akhlak?', 'Ilmu tentang Tuhan', 'Budi pekerti atau perilaku', 'Ilmu tentang alam', 'Ilmu tentang hukum', 'B', 'easy', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Rasulullah SAW diutus untuk menyempurnakan?', 'Ilmu pengetahuan', 'Akhlak mulia', 'Kekayaan', 'Kekuasaan', 'B', 'easy', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Apa hukum berkata jujur?', 'Sunnah', 'Wajib', 'Mubah', 'Makruh', 'B', 'easy', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Termasuk akhlak tercela adalah?', 'Jujur', 'Tawadhu', 'Hasad (dengki)', 'Sabar', 'C', 'easy', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Apa yang dimaksud tawadhu?', 'Sombong', 'Rendah hati', 'Pemaaf', 'Pemarah', 'B', 'easy', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Ucapan yang baik disebut?', 'Qaulan karima', 'Qaulan baligha', 'Qaulan sadida', 'Qaulan ma\'rufa', 'D', 'medium', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Hukum menepati janji adalah?', 'Sunnah', 'Wajib', 'Mubah', 'Makruh', 'B', 'medium', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Akhlak buruk yang paling besar adalah?', 'Malas', 'Kikir', 'Sombong (takabur)', 'Marah', 'C', 'medium', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Riya adalah melakukan ibadah karena ingin?', 'Allah', 'pahala', 'Dipuji manusia', 'Surga', 'C', 'medium', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Apa arti husnudzan?', 'Prasangka buruk', 'Prasangka baik', 'Dendam', 'Benci', 'B', 'easy', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Adab kepada guru adalah?', 'Membantah', 'Menghormati', 'Mendebat', 'Mengabaikan', 'B', 'easy', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Termasuk birrul walidain adalah?', 'Durhaka', 'Berbakti', 'Membentak', 'Mencaci', 'B', 'easy', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Syukur dapat diwujudkan dengan?', 'Nikmat', 'Lisan, hati, perbuatan', 'Harta', 'Ibadah', 'B', 'medium', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Apa itu sabar?', 'Putus asa', 'Menahan diri dalam ketaatan', 'Marah', 'Dendam', 'B', 'medium', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Dosa ghibah (gosip) adalah?', 'Kecil', 'Besar seperti memakan bangkai saudara', 'Sunnah', 'Mubah', 'B', 'medium', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Sikap qanaah adalah?', 'Serakah', 'Menerima dengan cukup', 'Tamak', 'Boros', 'B', 'medium', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Termasuk akhlak terpuji adalah?', 'Dendam', 'Iri', 'Tasamuh (toleran)', 'Ghibah', 'C', 'medium', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Apa arti ukhuwwah?', 'Permusuhan', 'Persaudaraan', 'Kebencian', 'Perpecahan', 'B', 'easy', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Adab makan dalam Islam adalah?', 'Berdiri', 'Makan sambil tidur', 'Duduk dan membaca basmalah', 'Bersandar', 'C', 'easy', 10, 30),
('adab-akhlaq', 'tembak-soal', 'Akhlak kepada tetangga adalah?', 'Mengganggu', 'Berbuat baik', 'Membenci', 'Menghina', 'B', 'easy', 10, 30);

-- KILAT MENJAWAB (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, correct_option, difficulty, points, time_limit_seconds) VALUES
('adab-akhlaq', 'kilat-menjawab', 'Akhlak mulia adalah ajaran inti Islam.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Rasulullah SAW diutus untuk menyempurnakan harta.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Berkata jujur hukumnya wajib.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Takabur adalah akhlak terpuji.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Tawadhu berarti rendah hati.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Riya adalah ikhlas karena Allah.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Ghibah adalah dosa besar.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Berbakti kepada orang tua hukumnya wajib.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Husnudzan adalah prasangka buruk.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Sabar adalah menahan diri dalam ketaatan.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Qanaah berarti selalu merasa kurang.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Ukhuwwah artinya persaudaraan.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Tasamuh berarti toleransi.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Adab makan dalam Islam adalah sambil berdiri.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Menepati janji hukumnya sunnah.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Dendam termasuk akhlak terpuji.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Membentak orang tua adalah durhaka.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Ikhlas adalah melakukan ibadah karena Allah.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Syukur hanya diucapkan dengan lisan.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('adab-akhlaq', 'kilat-menjawab', 'Pemaaf adalah akhlak mulia.', 'Benar', 'Salah', 'A', 'easy', 10, 30);

-- TTS WORDS (20)
INSERT INTO pvp_tts_words (mapel_id, clue, answer, points) VALUES
('adab-akhlaq', 'Budi pekerti mulia', 'AKHLAK', 15),
('adab-akhlaq', 'Rendah hati', 'TAWADHU', 15),
('adab-akhlaq', 'Prasangka baik', 'HUSNUDZAN', 15),
('adab-akhlaq', 'Prasangka buruk', 'SUUDZAN', 15),
('adab-akhlaq', 'Menahan diri dalam ketaatan', 'SABAR', 15),
('adab-akhlaq', 'Bersyukur dengan menerima', 'QANAAH', 15),
('adab-akhlaq', 'Persaudaraan sesama muslim', 'UKHUWWAH', 15),
('adab-akhlaq', 'Toleransi dalam Islam', 'TASAMUH', 15),
('adab-akhlaq', 'Ikhlas karena Allah', 'RIDHA', 15),
('adab-akhlaq', 'Berbakti kepada orang tua', 'BIRRULWALIDAIN', 15),
('adab-akhlaq', 'Menjaga lisan dari gosip', 'GHIBAH', 15),
('adab-akhlaq', 'Sombong', 'TAKABUR', 15),
('adab-akhlaq', 'Dengki', 'HASAD', 15),
('adab-akhlaq', 'Pamer dalam ibadah', 'RIYA', 15),
('adab-akhlaq', 'Berbuat baik kepada tetangga', 'JIRAN', 15),
('adab-akhlaq', 'Menepati apa yang diucapkan', 'JANJI', 15),
('adab-akhlaq', 'Pemaaf', 'AFUW', 15),
('adab-akhlaq', 'Pemurah', 'KARIM', 15),
('adab-akhlaq', 'Ucapan yang baik', 'MAK RUFA', 15),
('adab-akhlaq', 'Berkata benar', 'JUJUR', 15);

-- CORRECTION SENTENCES (20)
INSERT INTO pvp_correction_sentences (mapel_id, wrong_sentence, correct_sentence, points) VALUES
('adab-akhlaq', 'Akhlak adalah ilmu tentang harta.', 'Akhlak adalah budi pekerti atau perilaku.', 20),
('adab-akhlaq', 'Rasulullah diutus untuk menyempurnakan kekuasaan.', 'Rasulullah diutus untuk menyempurnakan akhlak mulia.', 20),
('adab-akhlaq', 'Berkata dusta hukumnya sunnah.', 'Berkata dusta hukumnya haram.', 20),
('adab-akhlaq', 'Takabur adalah akhlak terpuji.', 'Takabur (sombong) adalah akhlak tercela.', 20),
('adab-akhlaq', 'Riya adalah beribadah ikhlas karena Allah.', 'Riya adalah beribadah ingin dipuji manusia.', 20),
('adab-akhlaq', 'Husnudzan adalah prasangka buruk.', 'Husnudzan adalah prasangka baik.', 20),
('adab-akhlaq', 'Menepati janji hukumnya sunnah.', 'Menepati janji hukumnya wajib.', 20),
('adab-akhlaq', 'Ghibah adalah dosa ringan.', 'Ghibah adalah dosa besar.', 20),
('adab-akhlaq', 'Sabar berarti putus asa.', 'Sabar berarti menahan diri dalam ketaatan kepada Allah.', 20),
('adab-akhlaq', 'Qanaah berarti serakah.', 'Qanaah berarti menerima dengan cukup.', 20),
('adab-akhlaq', 'Adab makan dalam Islam adalah sambil tiduran.', 'Adab makan dalam Islam adalah duduk dan membaca basmalah.', 20),
('adab-akhlaq', 'Syukur hanya di lidah saja.', 'Syukur dilakukan dengan hati, lisan, dan perbuatan.', 20),
('adab-akhlaq', 'Birrul walidain berarti durhaka.', 'Birrul walidain berarti berbakti kepada orang tua.', 20),
('adab-akhlaq', 'Ukhuwwah artinya permusuhan.', 'Ukhuwwah artinya persaudaraan.', 20),
('adab-akhlaq', 'Tasamuh berarti intoleran.', 'Tasamuh berarti toleran.', 20),
('adab-akhlaq', 'Dendam termasuk akhlak mulia.', 'Dendam termasuk akhlak tercela.', 20),
('adab-akhlaq', 'Membentak orang tua adalah hal biasa.', 'Membentak orang tua termasuk durhaka.', 20),
('adab-akhlaq', 'Ikhlas berarti mengharap imbalan.', 'Ikhlas berarti melakukan sesuatu semata-mata karena Allah.', 20),
('adab-akhlaq', 'Pemaaf adalah sikap buruk.', 'Pemaaf adalah akhlak mulia.', 20),
('adab-akhlaq', 'Boros (israf) adalah terpuji.', 'Boros (israf) adalah tercela.', 20);

-- ===============================================================
-- MAPEL: sirah-nabawiyah
-- ===============================================================

-- TEMBAK SOAL (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, points, time_limit_seconds) VALUES
('sirah-nabawiyah', 'tembak-soal', 'Tahun berapa Nabi Muhammad SAW lahir?', '570 M', '571 M', '572 M', '573 M', 'B', 'medium', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Di kota mana Nabi Muhammad SAW lahir?', 'Madinah', 'Mekah', 'Thaif', 'Yaman', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Siapa nama ibu Nabi Muhammad SAW?', 'Siti Khadijah', 'Siti Aminah', 'Siti Fatimah', 'Siti Aisyah', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Siapa kakek Nabi Muhammad SAW yang merawatnya setelah ibu wafat?', 'Abu Thalib', 'Abdul Muththalib', 'Hamzah', 'Abbas', 'B', 'medium', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Peristiwa penyerangan Ka\'bah oleh Abrahah disebut?', 'Fathu Mekah', 'Amul Fil', 'Hijrah', 'Perang Badar', 'B', 'medium', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Siapa nama istri pertama Nabi Muhammad SAW?', 'Aisyah', 'Khadijah', 'Hafsah', 'Zainab', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Nabi Muhammad SAW mendapat wahyu pertama di?', 'Masjid Nabawi', 'Gua Hira', 'Gua Tsur', 'Padang Arafah', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Surah pertama yang diturunkan adalah?', 'Al-Fatihah', 'Al-Alaq', 'Al-Muddassir', 'An-Nas', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Tujuan hijrah Nabi ke Madinah adalah?', 'Berdagang', 'Menyebarkan Islam dengan aman', 'Berlibur', 'Bersembunyi', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Siapa yang menemani Nabi hijrah ke Madinah?', 'Ali bin Abi Thalib', 'Abu Bakar', 'Umar bin Khattab', 'Utsman bin Affan', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Perang Badar terjadi pada tahun?', '1 H', '2 H', '3 H', '4 H', 'B', 'medium', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Berapa jumlah pasukan Muslim dalam Perang Badar?', '313', '500', '1000', '700', 'A', 'hard', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Perjanjian Hudaibiyah terjadi tahun?', '5 H', '6 H', '7 H', '8 H', 'B', 'hard', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Fathu Mekah (Pembebasan Mekah) terjadi tahun?', '6 H', '7 H', '8 H', '9 H', 'C', 'medium', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Siapa paman Nabi yang gugur di Perang Uhud?', 'Abbas', 'Hamzah', 'Abu Thalib', 'Harits', 'B', 'medium', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Nabi Muhammad SAW wafat pada usia?', '60 tahun', '63 tahun', '65 tahun', '70 tahun', 'B', 'medium', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Siapa khulafaur rasyidin yang pertama?', 'Umar', 'Utsman', 'Ali', 'Abu Bakar', 'D', 'easy', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Masjid pertama yang dibangun Nabi adalah?', 'Masjidil Haram', 'Masjid Nabawi', 'Masjid Quba', 'Masjid Aqsa', 'C', 'medium', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Perang Khandaq disebut juga perang?', 'Badar', 'Uhud', 'Ahzab', 'Tabuk', 'C', 'medium', 10, 30),
('sirah-nabawiyah', 'tembak-soal', 'Sahabat yang dijuluki "As-Siddiq" adalah?', 'Umar', 'Utsman', 'Ali', 'Abu Bakar', 'D', 'easy', 10, 30);

-- KILAT MENJAWAB (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, correct_option, difficulty, points, time_limit_seconds) VALUES
('sirah-nabawiyah', 'kilat-menjawab', 'Nabi Muhammad SAW lahir di kota Mekah.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Ibu Nabi bernama Siti Khadijah.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Wahyu pertama turun di Gua Tsur.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Nabi Muhammad SAW diangkat menjadi rasul pada usia 40 tahun.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Istri pertama Nabi adalah Siti Aisyah.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Abu Bakar menemani Nabi saat hijrah.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Perang Badar terjadi pada tahun 3 H.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Paman Nabi yang gugur di Uhud adalah Hamzah.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Fathu Mekah terjadi tahun 8 H.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Perjanjian Hudaibiyah terjadi tahun 6 H.', 'Benar', 'Salah', 'A', 'hard', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Masjid Quba adalah masjid pertama yang dibangun Nabi.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Perang Ahzab disebut juga perang Khandaq.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Nabi wafat pada usia 65 tahun.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Abu Bakar dijuluki As-Siddiq.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Khulafaur Rasyidin ada 5.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Perang Uhud terjadi tahun 3 H.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Tahun Gajah adalah tahun kelahiran Nabi.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Umar bin Khattab adalah khulafaur rasyidin pertama.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Surah Al-Alaq adalah wahyu pertama.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('sirah-nabawiyah', 'kilat-menjawab', 'Hijrah ke Madinah dilakukan secara terang-terangan.', 'Benar', 'Salah', 'B', 'medium', 10, 30);

-- TTS WORDS (20)
INSERT INTO pvp_tts_words (mapel_id, clue, answer, points) VALUES
('sirah-nabawiyah', 'Kota kelahiran Nabi', 'MEKAH', 15),
('sirah-nabawiyah', 'Kota tujuan hijrah Nabi', 'MADINAH', 15),
('sirah-nabawiyah', 'Ibu Nabi Muhammad SAW', 'AMINAH', 15),
('sirah-nabawiyah', 'Istri pertama Nabi', 'KHADIJAH', 15),
('sirah-nabawiyah', 'Gua tempat wahyu pertama', 'HIRA', 15),
('sirah-nabawiyah', 'Gua tempat persembunyian hijrah', 'TSUR', 15),
('sirah-nabawiyah', 'Tahun kelahiran Nabi disebut', 'AMULFIL', 15),
('sirah-nabawiyah', 'Sahabat yang menemani hijrah', 'ABUBAKAR', 15),
('sirah-nabawiyah', 'Perang pertama dalam Islam', 'BADAR', 15),
('sirah-nabawiyah', 'Perang kedua dalam Islam', 'UHUD', 15),
('sirah-nabawiyah', 'Perang parit', 'KHANDAQ', 15),
('sirah-nabawiyah', 'Perjanjian damai dengan Quraisy', 'HUDAIBIYAH', 15),
('sirah-nabawiyah', 'Pembebasan kota Mekah', 'FATHU', 15),
('sirah-nabawiyah', 'Paman Nabi yang syahid di Uhud', 'HAMZAH', 15),
('sirah-nabawiyah', 'Masjid pertama dibangun Nabi', 'QUBA', 15),
('sirah-nabawiyah', 'Khulafaur Rasyidin pertama', 'ABUBAKAR', 15),
('sirah-nabawiyah', 'Khulafaur Rasyidin kedua', 'UMAR', 15),
('sirah-nabawiyah', 'Khulafaur Rasyidin ketiga', 'UTSMAN', 15),
('sirah-nabawiyah', 'Khulafaur Rasyidin keempat', 'ALI', 15),
('sirah-nabawiyah', 'Usia Nabi saat wafat', 'ENAMPULUHTIGA', 15);

-- CORRECTION SENTENCES (20)
INSERT INTO pvp_correction_sentences (mapel_id, wrong_sentence, correct_sentence, points) VALUES
('sirah-nabawiyah', 'Nabi Muhammad SAW lahir di Madinah.', 'Nabi Muhammad SAW lahir di Mekah.', 20),
('sirah-nabawiyah', 'Ibu Nabi bernama Siti Khadijah.', 'Ibu Nabi bernama Siti Aminah.', 20),
('sirah-nabawiyah', 'Wahyu pertama turun di Gua Tsur.', 'Wahyu pertama turun di Gua Hira.', 20),
('sirah-nabawiyah', 'Istri pertama Nabi adalah Siti Aisyah.', 'Istri pertama Nabi adalah Siti Khadijah.', 20),
('sirah-nabawiyah', 'Abu Jahal menemani Nabi hijrah.', 'Abu Bakar yang menemani Nabi hijrah.', 20),
('sirah-nabawiyah', 'Perang Badar terjadi tahun 3 H.', 'Perang Badar terjadi tahun 2 H.', 20),
('sirah-nabawiyah', 'Perang Khandaq disebut juga perang Badar.', 'Perang Khandaq disebut juga perang Ahzab.', 20),
('sirah-nabawiyah', 'Fathu Mekah terjadi tahun 9 H.', 'Fathu Mekah terjadi tahun 8 H.', 20),
('sirah-nabawiyah', 'Hamzah adalah paman Nabi yang kafir.', 'Hamzah adalah paman Nabi yang muslim dan syahid.', 20),
('sirah-nabawiyah', 'Masjid Quba dibangun di Mekah.', 'Masjid Quba dibangun di Madinah.', 20),
('sirah-nabawiyah', 'Khulafaur Rasyidin ada 5 orang.', 'Khulafaur Rasyidin ada 4 orang.', 20),
('sirah-nabawiyah', 'Nabi wafat pada usia 70 tahun.', 'Nabi wafat pada usia 63 tahun.', 20),
('sirah-nabawiyah', 'Abu Bakar dijuluki Al-Faruq.', 'Abu Bakar dijuluki As-Siddiq.', 20),
('sirah-nabawiyah', 'Umar bin Khattab adalah khulafaur rasyidin ke-3.', 'Umar bin Khattab adalah khulafaur rasyidin ke-2.', 20),
('sirah-nabawiyah', 'Surah Al-Fatihah adalah wahyu pertama.', 'Surah Al-Alaq adalah wahyu pertama.', 20),
('sirah-nabawiyah', 'Perjanjian Hudaibiyah terjadi tahun 8 H.', 'Perjanjian Hudaibiyah terjadi tahun 6 H.', 20),
('sirah-nabawiyah', 'Khadijah wafat sebelum Nabi diangkat menjadi rasul.', 'Khadijah adalah istri pertama yang mendukung dakwah Nabi.', 20),
('sirah-nabawiyah', 'Pasukan Muslim dalam Perang Badar berjumlah 1000.', 'Pasukan Muslim dalam Perang Badar berjumlah 313.', 20),
('sirah-nabawiyah', 'Nabi diangkat menjadi rasul pada usia 30 tahun.', 'Nabi diangkat menjadi rasul pada usia 40 tahun.', 20),
('sirah-nabawiyah', 'Perang Uhud dimenangkan oleh kaum Muslim.', 'Perang Uhud merupakan ujian bagi kaum Muslim.', 20);

-- ===============================================================
-- MAPEL: tafsir-juz-amma
-- ===============================================================

-- TEMBAK SOAL (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, points, time_limit_seconds) VALUES
('tafsir-juz-amma', 'tembak-soal', 'Surat apa yang pertama dalam Juz Amma?', 'An-Nas', 'Al-Fatihah', 'An-Naba', 'Al-Alaq', 'C', 'easy', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Apa arti "An-Naba"?', 'Manusia', 'Berita besar', 'Matahari', 'Malam', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Surat An-Nasr menceritakan tentang?', 'Kiamat', 'Pertolongan Allah dan fathu Mekah', 'Neraka', 'Surga', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Apa isi pokok surat Al-Ikhlas?', 'Kisah nabi', 'KeEsaan Allah', 'Hari kiamat', 'Perintah shalat', 'B', 'easy', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Surat Al-Falaq dan An-Nas disebut?', 'Al-Mufassal', 'Al-Mu\'awwidzatain', 'As-Sab\'u At-Tiwal', 'Al-Mumtahanah', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Apa arti "Al-Ashr"?', 'Waktu/masa', 'Malam', 'Fajar', 'Dhuha', 'A', 'easy', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Dalam surat Al-Ma\'un, orang yang mendustakan agama adalah yang?', 'Rajin shalat', 'Menghardik anak yatim', 'Bersedekah', 'Beriman', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Surat At-Takatsur mengecam orang yang?', 'Malas', 'Bermegah-megahan', 'Kikir', 'Pemarah', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Apa yang dimaksud dengan "Yaumul Qiyamah"?', 'Hari senang', 'Hari kiamat', 'Hari raya', 'Hari jumat', 'B', 'easy', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Dalam surat Az-Zalzalah, bumi mengeluarkan?', 'Air', 'Api', 'Beban-beban berat', 'Pohon', 'C', 'hard', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Surat Al-Qariah menggambarkan tentang?', 'Pertolongan', 'Hari kiamat yang menggentarkan', 'Nikmat', 'Rezeki', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Apa arti "Al-Humazah"?', 'Pengumpat/pencela', 'Pemberi', 'Penyabar', 'Pemaaf', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Surat Al-Fatihah disebut juga?', 'Ummul Quran', 'Al-Muawwidzatain', 'Al-Ikhlas', 'Al-Masad', 'A', 'easy', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Hukum orang yang membaca Al-Quran dengan tartil adalah?', 'Sunnah', 'Wajib', 'Mubah', 'Makruh', 'B', 'hard', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Surat Al-Lahab menceritakan tentang?', 'Abu Lahab', 'Nabi Nuh', 'Nabi Musa', 'Firaun', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Apa arti "Ad-Dhuha"?', 'Malam', 'Waktu duha/pagi', 'Petang', 'Siang', 'B', 'easy', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Dalam surat Al-Qadr, malam Lailatul Qadr lebih baik dari?', '1000 malam', '1000 bulan', '100 tahun', '1000 tahun', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Surat Al-Alaq berisi perintah untuk?', 'Berdagang', 'Membaca', 'Berperang', 'Bersedekah', 'B', 'easy', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Apa tema utama surat Az-Zalzalah?', 'Nikmat Allah', 'Guncangan hari kiamat', 'Kisah Nabi', 'Perintah puasa', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'tembak-soal', 'Surat terakhir dalam Juz Amma adalah?', 'Al-Fatihah', 'An-Nas', 'Al-Ikhlas', 'Al-Falaq', 'B', 'easy', 10, 30);

-- KILAT MENJAWAB (20)
INSERT INTO pvp_questions (mapel_id, mode, question_text, option_a, option_b, correct_option, difficulty, points, time_limit_seconds) VALUES
('tafsir-juz-amma', 'kilat-menjawab', 'Juz Amma adalah juz ke-30 dalam Al-Quran.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Surat pertama Juz Amma adalah An-Nas.', 'Benar', 'Salah', 'B', 'easy', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'An-Naba artinya berita besar.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Surat Al-Fatihah termasuk Juz Amma.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Al-Ikhlas berisi tentang keesaan Allah.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Al-Falaq dan An-Nas disebut Al-Mu\'awwidzatain.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Al-Ashr artinya waktu.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Az-Zalzalah berarti gempa.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Al-Qadr turun tentang malam Lailatul Qadr.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Surat Al-Masad menceritakan tentang Abu Lahab.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Al-Humazah artinya pengumpat.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'At-Takatsur mengecam orang bermegah-megahan.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Al-Qariah artinya bencana besar.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Surat Al-Alaq berisi perintah membaca.', 'Benar', 'Salah', 'A', 'easy', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Ad-Dhuha artinya malam.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Al-Insyirah menceritakan tentang kelapangan dada.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'At-Tin artinya buah zaitun.', 'Benar', 'Salah', 'B', 'hard', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Lailatul Qadr lebih baik dari 1000 bulan.', 'Benar', 'Salah', 'A', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Al-Ma\'un mendorong untuk menghardik anak yatim.', 'Benar', 'Salah', 'B', 'medium', 10, 30),
('tafsir-juz-amma', 'kilat-menjawab', 'Juz Amma terdiri dari 37 surat.', 'Benar', 'Salah', 'A', 'hard', 10, 30);

-- TTS WORDS (20)
INSERT INTO pvp_tts_words (mapel_id, clue, answer, points) VALUES
('tafsir-juz-amma', 'Surat pertama Juz Amma', 'ANNABA', 15),
('tafsir-juz-amma', 'Berita besar dalam surat An-Naba', 'NABA', 15),
('tafsir-juz-amma', 'Surat tentang keesaan Allah', 'IKHLAS', 15),
('tafsir-juz-amma', 'Dua surat perlindungan', 'MUAWWIDZATAIN', 15),
('tafsir-juz-amma', 'Masa/waktu dalam surat Al-Ashr', 'ASHR', 15),
('tafsir-juz-amma', 'Menghardik anak yatim dalam Al-Maun', 'MAUN', 15),
('tafsir-juz-amma', 'Bermegah-megahan dalam At-Takatsur', 'TAKATSUR', 15),
('tafsir-juz-amma', 'Hari kiamat', 'QIYAMAH', 15),
('tafsir-juz-amma', 'Gempa dalam surat Az-Zalzalah', 'ZALZALAH', 15),
('tafsir-juz-amma', 'Hari kiamat yang menggentarkan', 'QARIAH', 15),
('tafsir-juz-amma', 'Pengumpat dalam surat Al-Humazah', 'HUMAZAH', 15),
('tafsir-juz-amma', 'Abu Lahab dalam surat Al-Masad', 'LAHAB', 15),
('tafsir-juz-amma', 'Waktu pagi dalam surat Ad-Dhuha', 'DHUHA', 15),
('tafsir-juz-amma', 'Perintah membaca dalam Al-Alaq', 'IQRA', 15),
('tafsir-juz-amma', 'Malam kemuliaan', 'LAILATULQADR', 15),
('tafsir-juz-amma', 'Pertolongan Allah dalam An-Nasr', 'NASR', 15),
('tafsir-juz-amma', 'Buah tin dalam surat At-Tin', 'TIIN', 15),
('tafsir-juz-amma', 'Kelapangan dada dalam Al-Insyirah', 'INSYIRAH', 15),
('tafsir-juz-amma', 'Surat terakhir Juz Amma', 'ANNAS', 15),
('tafsir-juz-amma', 'Ibu Al-Quran (Al-Fatihah)', 'UMMULQURAN', 15);

-- CORRECTION SENTENCES (20)
INSERT INTO pvp_correction_sentences (mapel_id, wrong_sentence, correct_sentence, points) VALUES
('tafsir-juz-amma', 'Surat pertama Juz Amma adalah Al-Fatihah.', 'Surat pertama Juz Amma adalah An-Naba.', 20),
('tafsir-juz-amma', 'An-Naba artinya manusia.', 'An-Naba artinya berita besar.', 20),
('tafsir-juz-amma', 'Al-Ikhlas menceritakan tentang neraka.', 'Al-Ikhlas menceritakan tentang keesaan Allah.', 20),
('tafsir-juz-amma', 'Al-Falaq dan An-Nas disebut As-Sab\'u At-Tiwal.', 'Al-Falaq dan An-Nas disebut Al-Mu\'awwidzatain.', 20),
('tafsir-juz-amma', 'Al-Ashr artinya kekayaan.', 'Al-Ashr artinya waktu/masa.', 20),
('tafsir-juz-amma', 'Al-Ma\'un mendorong menghardik anak yatim.', 'Al-Ma\'un mencela orang yang menghardik anak yatim.', 20),
('tafsir-juz-amma', 'At-Takatsur memuji orang yang bermegah-megahan.', 'At-Takatsur mengecam orang yang bermegah-megahan.', 20),
('tafsir-juz-amma', 'Al-Humazah artinya penyabar.', 'Al-Humazah artinya pengumpat/pencela.', 20),
('tafsir-juz-amma', 'Ad-Dhuha artinya malam.', 'Ad-Dhuha artinya waktu pagi/duha.', 20),
('tafsir-juz-amma', 'Lailatul Qadr lebih baik dari 1000 tahun.', 'Lailatul Qadr lebih baik dari 1000 bulan.', 20),
('tafsir-juz-amma', 'Surat Al-Alaq adalah surat ke-96.', 'Surat Al-Alaq adalah surat ke-96 dalam Al-Quran.', 20),
('tafsir-juz-amma', 'Al-Qariah artinya ketenangan.', 'Al-Qariah artinya hari kiamat yang menggetarkan.', 20),
('tafsir-juz-amma', 'Az-Zalzalah berarti kedamaian.', 'Az-Zalzalah berarti gempa/guncangan.', 20),
('tafsir-juz-amma', 'At-Tin artinya buah anggur.', 'At-Tin artinya buah tin.', 20),
('tafsir-juz-amma', 'Al-Insyirah berarti kesempitan.', 'Al-Insyirah berarti kelapangan dada.', 20),
('tafsir-juz-amma', 'An-Nasr berarti kekalahan.', 'An-Nasr berarti pertolongan.', 20),
('tafsir-juz-amma', 'Al-Masad menceritakan tentang Abu Jahal.', 'Al-Masad menceritakan tentang Abu Lahab.', 20),
('tafsir-juz-amma', 'Surat terakhir Juz Amma adalah Al-Ikhlas.', 'Surat terakhir Juz Amma adalah An-Nas.', 20),
('tafsir-juz-amma', 'Juz Amma terdiri dari 40 surat.', 'Juz Amma terdiri dari 37 surat.', 20),
('tafsir-juz-amma', 'Al-Qadr turun tentang perintah puasa.', 'Al-Qadr turun tentang malam Lailatul Qadr.', 20);
