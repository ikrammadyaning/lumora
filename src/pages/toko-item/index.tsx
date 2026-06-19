import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/context/UserContext"
import { useSocketContext } from "@/context/SocketProvider"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

interface ShopItem {
  id: string
  name: string
  description: string
  category: 'bingkai' | 'tema' | 'efek'
  rarity: string
  icon: string
  price: number
  config: Record<string, any>
}

const FILTERS = [
  { key: 'semua', label: 'Semua' },
  { key: 'bingkai', label: 'Bingkai' },
  { key: 'tema', label: 'Tema' },
  { key: 'efek', label: 'Efek' },
] as const

const RARITY_STYLES: Record<string, { label: string, bg: string, border: string, text: string }> = {
  biasa: { label: 'Biasa', bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-600' },
  langka: { label: 'Langka', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  epik: { label: 'Epik', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  legendaris: { label: 'Legendaris', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
}

export default function TokoItemPage() {
  const { user } = useUser()
  const { socket } = useSocketContext()
  const [items, setItems] = useState<ShopItem[]>([])
  const [ownedItemIds, setOwnedItemIds] = useState<Set<string>>(new Set())
  const [equippedIds, setEquippedIds] = useState<{ bingkai: string|null, tema: string|null, efek: string|null }>({
    bingkai: null, tema: null, efek: null
  })
  const [userCoins, setUserCoins] = useState(0)
  const [activeFilter, setActiveFilter] = useState<'semua'|'bingkai'|'tema'|'efek'>('semua')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: shopData } = await supabase.from('shop_items').select('*').eq('is_active', true)
      setItems(shopData || [])

      if (!user) {
        setLoading(false)
        return
      }

      const { data: inventoryData } = await supabase
        .from('user_inventory')
        .select('item_id')
        .eq('user_id', user.id)
      setOwnedItemIds(new Set((inventoryData || []).map(i => i.item_id)))

      const { data: userData } = await supabase
        .from('users')
        .select('coins, equipped_bingkai_id, equipped_tema_id, equipped_efek_id')
        .eq('id', user.id)
        .single()

      if (userData) {
        setUserCoins(userData.coins || 0)
        setEquippedIds({
          bingkai: userData.equipped_bingkai_id,
          tema: userData.equipped_tema_id,
          efek: userData.equipped_efek_id
        })
      }
      setLoading(false)
    }
    fetchData()
  }, [user])

  useEffect(() => {
    if (!socket) return

    const onBuyResult = (result: any) => {
      if (result.success) {
        setUserCoins(result.newCoins)
        setOwnedItemIds(prev => new Set([...prev, result.item.id]))
      }
      alert(result.message)
    }

    const onEquipResult = (result: any) => {
      if (result.success) {
        setEquippedIds(prev => ({ ...prev, [result.category]: result.itemId }))
      }
    }

    const onUnequipResult = (result: any) => {
      if (result.success) {
        setEquippedIds(prev => ({ ...prev, [result.category]: null }))
      }
    }

    socket.on('buy_item_result', onBuyResult)
    socket.on('equip_item_result', onEquipResult)
    socket.on('unequip_item_result', onUnequipResult)

    return () => {
      socket.off('buy_item_result', onBuyResult)
      socket.off('equip_item_result', onEquipResult)
      socket.off('unequip_item_result', onUnequipResult)
    }
  }, [socket])

  const handleBuyOrEquip = (item: ShopItem) => {
    if (!user || !socket) return
    const isOwned = ownedItemIds.has(item.id)

    if (isOwned) {
      const isEquipped = equippedIds[item.category] === item.id
      if (isEquipped) {
        socket.emit('unequip_item', { userId: user.id, category: item.category })
      } else {
        socket.emit('equip_item', { userId: user.id, itemId: item.id, category: item.category })
      }
    } else {
      if (userCoins < item.price) {
        alert('Koin tidak cukup!')
        return
      }
      socket.emit('buy_item', { userId: user.id, itemId: item.id })
    }
  }

  const filteredItems = activeFilter === 'semua'
    ? items
    : items.filter(i => i.category === activeFilter)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1a2e2a] to-[#0f1f1c] rounded-3xl p-6 flex items-center justify-between"
          >
            <div>
              <h1 className="text-xl font-bold text-white">Toko Item</h1>
              <p className="text-emerald-400/80 text-sm mt-1">
                Tukarkan koin-mu dengan item eksklusif!
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2.5">
              <span className="text-lg">🪙</span>
              <span className="text-white font-bold text-lg">{userCoins.toLocaleString()}</span>
              <span className="text-emerald-400/60 text-xs">Koin</span>
            </div>
          </motion.div>

          {/* FILTER */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeFilter === f.key
                      ? 'text-white shadow-lg shadow-emerald-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
                }`}
                style={activeFilter === f.key ? { backgroundColor: 'var(--accent-color)' } : undefined}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* ITEM LIST */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-2xl p-5 animate-pulse border border-gray-100" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="h-4 w-32 bg-gray-200 rounded mt-4" />
                  <div className="h-3 w-48 bg-gray-100 rounded mt-2" />
                  <div className="h-10 w-full bg-gray-100 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">📦</span>
              <p className="text-gray-400 text-sm mt-4">Tidak ada item di kategori ini</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, idx) => {
                const isOwned = ownedItemIds.has(item.id)
                const isEquipped = equippedIds[item.category] === item.id
                const cantAfford = !isOwned && userCoins < item.price
                const rarityStyle = RARITY_STYLES[item.rarity] || RARITY_STYLES.biasa

                let buttonLabel: string
                let buttonStyle: string

                if (isEquipped) {
                  buttonLabel = '✓ Dipakai'
                  buttonStyle = 'text-white cursor-pointer'
                } else if (isOwned) {
                  buttonLabel = 'Pakai'
                  buttonStyle = 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                } else if (cantAfford) {
                  buttonLabel = `${item.price} koin`
                  buttonStyle = 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                } else {
                  buttonLabel = `${item.price} koin`
                  buttonStyle = 'text-white hover:bg-emerald-600 cursor-pointer'
                }

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-2xl p-5 border ${rarityStyle.border} shadow-sm hover:shadow-md transition-all`} style={{ backgroundColor: 'var(--card-bg)' }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{item.icon}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rarityStyle.bg} ${rarityStyle.text}`}>
                        {rarityStyle.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-800 mt-3">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.description}</p>

                    <button
                      onClick={() => handleBuyOrEquip(item)}
                      disabled={cantAfford}
                      className={`mt-4 w-full py-2.5 rounded-xl text-sm font-bold transition-all ${buttonStyle}`}
                      style={!ownedItemIds.has(item.id) || equippedIds[item.category] === item.id ? { backgroundColor: 'var(--accent-color)' } : undefined}
                    >
                      {buttonLabel}
                    </button>
                  </motion.div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
