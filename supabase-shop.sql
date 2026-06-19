-- ============================================================
-- TOKO ITEM / SHOP SYSTEM
-- Menambahkan tabel shop_items, user_inventory, dan kolom
-- equipped_* di tabel users
-- ============================================================

-- 1. TABEL SHOP_ITEMS
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('bingkai', 'tema', 'efek')),
  rarity TEXT NOT NULL CHECK (rarity IN ('biasa', 'langka', 'epik', 'legendaris')),
  icon TEXT NOT NULL,
  price INTEGER NOT NULL,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "shop_items_read_all" ON shop_items;
CREATE POLICY "shop_items_read_all" ON shop_items FOR SELECT USING (true);

-- 2. TABEL USER_INVENTORY
CREATE TABLE IF NOT EXISTS user_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES shop_items(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  is_equipped BOOLEAN DEFAULT false,
  UNIQUE(user_id, item_id)
);

ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_inventory_select" ON user_inventory;
DROP POLICY IF EXISTS "user_inventory_insert" ON user_inventory;
DROP POLICY IF EXISTS "user_inventory_update" ON user_inventory;

CREATE POLICY "user_inventory_select"
  ON user_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_inventory_insert"
  ON user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_inventory_update"
  ON user_inventory FOR UPDATE USING (auth.uid() = user_id);

-- 3. KOLOM EQUIPPED DI USERS
ALTER TABLE users
ADD COLUMN IF NOT EXISTS equipped_bingkai_id UUID REFERENCES shop_items(id),
ADD COLUMN IF NOT EXISTS equipped_tema_id UUID REFERENCES shop_items(id),
ADD COLUMN IF NOT EXISTS equipped_efek_id UUID REFERENCES shop_items(id);

-- 4. SEED DATA ITEM (hanya jika tabel masih kosong)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM shop_items LIMIT 1) THEN
    INSERT INTO shop_items (name, description, category, rarity, icon, price, config) VALUES
    ('Bingkai Emas Ramadan', 'Bingkai bercahaya emas eksklusif tema Ramadan', 'bingkai', 'epik', '🌙', 500,
      '{"borderColor": "#f59e0b", "borderStyle": "solid", "borderWidth": "4px", "glowColor": "#fbbf24"}'),
    ('Bingkai Zamrud', 'Bingkai hijau zamrud elegan', 'bingkai', 'langka', '💎', 300,
      '{"borderColor": "#10b981", "borderStyle": "solid", "borderWidth": "3px", "glowColor": "#34d399"}'),
    ('Bingkai Idul Fitri', 'Edisi terbatas Idul Fitri 1446H', 'bingkai', 'legendaris', '🕌', 800,
      '{"borderColor": "#22c55e", "borderStyle": "double", "borderWidth": "5px", "glowColor": "#4ade80"}'),
    ('Bingkai Isra Mi''raj', 'Tema malam agung Isra Mi''raj', 'bingkai', 'epik', '✨', 600,
      '{"borderColor": "#8b5cf6", "borderStyle": "solid", "borderWidth": "4px", "glowColor": "#a78bfa"}');

    INSERT INTO shop_items (name, description, category, rarity, icon, price, config) VALUES
    ('Tema Malam Quran', 'Ubah seluruh tampilan menjadi tema gelap malam', 'tema', 'legendaris', '🌙', 1000,
      '{"bgPrimary": "#0f172a", "bgSecondary": "#1e293b", "accentColor": "#fbbf24", "sidebarBg": "#020617", "textColor": "#f1f5f9", "cardBg": "#1e293b"}'),
    ('Tema Padang Pasir', 'Nuansa hangat gurun Arabia', 'tema', 'epik', '🏜️', 700,
      '{"bgPrimary": "#fef3e7", "bgSecondary": "#fde8d0", "accentColor": "#ea580c", "sidebarBg": "#7c2d12", "textColor": "#451a03", "cardBg": "#fffbf5"}'),
    ('Tema Madinah', 'Tema hijau segar kota Nabi ﷺ', 'tema', 'langka', '🕌', 500,
      '{"bgPrimary": "#f0fdf4", "bgSecondary": "#dcfce7", "accentColor": "#16a34a", "sidebarBg": "#14532d", "textColor": "#052e16", "cardBg": "#ffffff"}');

    INSERT INTO shop_items (name, description, category, rarity, icon, price, config) VALUES
    ('Efek Bintang Jatuh', 'Bintang-bintang beterbangan saat kamu klik menu', 'efek', 'langka', '⭐', 400,
      '{"animationType": "falling-stars", "particleColor": "#fbbf24", "intensity": "medium"}'),
    ('Efek Cahaya Hijau', 'Percikan cahaya emerald setiap interaksi', 'efek', 'biasa', '🌠', 250,
      '{"animationType": "sparkle", "particleColor": "#10b981", "intensity": "low"}');
  END IF;
END $$;
