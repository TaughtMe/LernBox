import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from './context/ThemeContext'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import DeckPage from './pages/DeckPage/DeckPage'
import './App.css'
import LearningPage from './pages/LearningPage/LearningPage'

function App() {
  const { theme } = useTheme()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deck/:deckId"
        element={
          <ProtectedRoute>
            <DeckPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/:deckId"
        element={
          <ProtectedRoute>
            <LearningPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
