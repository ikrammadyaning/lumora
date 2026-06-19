import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "./UserContext"

interface ThemeConfig {
  bgPrimary: string
  bgSecondary: string
  accentColor: string
  sidebarBg: string
  textColor: string
  cardBg: string
}

const defaultTheme: ThemeConfig = {
  bgPrimary: '#f9fafb',
  bgSecondary: '#ffffff',
  accentColor: '#10b981',
  sidebarBg: '#1a2e2a',
  textColor: '#1f2937',
  cardBg: '#ffffff'
}

const ThemeContext = createContext<ThemeConfig>(defaultTheme)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)

  useEffect(() => {
    if (!user) {
      setTheme(defaultTheme)
      return
    }

    const fetchTheme = async () => {
      const { data: userData } = await supabase
        .from('users')
        .select('equipped_tema_id')
        .eq('id', user.id)
        .single()

      if (!userData?.equipped_tema_id) {
        setTheme(defaultTheme)
        return
      }

      const { data: themeItem } = await supabase
        .from('shop_items')
        .select('config')
        .eq('id', userData.equipped_tema_id)
        .single()

      if (themeItem?.config) {
        setTheme({ ...defaultTheme, ...themeItem.config })
      }
    }

    fetchTheme()
  }, [user])

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-primary', theme.bgPrimary)
    document.documentElement.style.setProperty('--bg-secondary', theme.bgSecondary)
    document.documentElement.style.setProperty('--accent-color', theme.accentColor)
    document.documentElement.style.setProperty('--sidebar-bg', theme.sidebarBg)
    document.documentElement.style.setProperty('--text-color', theme.textColor)
    document.documentElement.style.setProperty('--card-bg', theme.cardBg)
  }, [theme])

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
