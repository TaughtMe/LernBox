import { createContext, useState, useContext } from 'react'
import type { ReactNode, FC } from 'react'

// 1. Definiere den Typ für den Context-Wert
interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

// 2. Erstelle den Context mit einem Standardwert
const AuthContext = createContext<AuthContextType>(null!)

// 3. Erstelle einen Custom Hook für die einfache Nutzung des Contexts
export const useAuth = () => {
  return useContext(AuthContext)
}

// 4. Definiere die Props für den Provider
interface AuthProviderProps {
  children: ReactNode
}

// 5. Erstelle die Provider-Komponente
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login = () => {
    setIsLoggedIn(true)
  }

  const logout = () => {
    setIsLoggedIn(false)
  }

  const value = {
    isLoggedIn,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
