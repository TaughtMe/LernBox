import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// 1. Definiere die möglichen Theme-Werte
type Theme = 'light' | 'dark'

// 2. Definiere die Struktur des Context-Wertes
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// 3. Erstelle den Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 4. Definiere die Props für den Provider
interface ThemeProviderProps {
  children: ReactNode
}

// 5. Erstelle die Provider-Komponente (korrigiert)
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light')

  // Dieser Hook wird bei jeder Änderung des Themes ausgeführt.
  // Er muss VOR der return-Anweisung stehen.
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  const value = { theme, toggleTheme }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// 6. Erstelle einen Custom Hook für den einfachen Zugriff auf den Context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
