-- Tabel riwayat setiap battle yang sudah selesai
CREATE TABLE IF NOT EXISTS pvp_battle_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL,
  mode TEXT NOT NULL,
  mapel_id TEXT,
  finished_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel hasil tiap pemain di setiap battle (1 baris per pemain per battle)
CREATE TABLE IF NOT EXISTS pvp_battle_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  battle_id UUID REFERENCES pvp_battle_history(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_bot BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  rank_in_battle INTEGER,
  is_winner BOOLEAN DEFAULT false,
  coins_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query cepat berdasarkan user
CREATE INDEX IF NOT EXISTS idx_pvp_results_user
  ON pvp_battle_results(user_id);

-- RLS Policies
ALTER TABLE pvp_battle_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pvp_battle_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pvp_history_read_all"
  ON pvp_battle_history FOR SELECT USING (true);

CREATE POLICY "pvp_results_read_all"
  ON pvp_battle_results FOR SELECT USING (true);

-- Hanya server (service role) yang boleh insert hasil battle,
-- bukan langsung dari client, untuk mencegah kecurangan
CREATE POLICY "pvp_results_insert_service_only"
  ON pvp_battle_results FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "pvp_history_insert_service_only"
  ON pvp_battle_history FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
