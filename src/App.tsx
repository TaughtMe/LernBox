import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { version as currentVersion } from './version'

import { useTheme } from './context/ThemeContext'
import { useDecks } from './context/DeckContext'

import DashboardPage from './pages/DashboardPage/DashboardPage'
import DeckPage from './pages/DeckPage/DeckPage'
import LearningPage from './pages/LearningPage/LearningPage'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import UpdateNotification from './components/UpdateNotification/UpdateNotification'

import ImpressumPage from './pages/ImpressumPage'
import LizenzenPage from './pages/LizenzenPage'

import './App.css'

function App() {
  const { theme } = useTheme()
  const { exportDecks } = useDecks()

  // Leerer String = keine Benachrichtigung. Gefüllt = neue Version verfügbar.
  const [newVersion, setNewVersion] = useState('')

  const { updateServiceWorker } = useRegisterSW({
    async onNeedRefresh() {
      try {
        // Wichtig: relativer Pfad für Pages/PWA
        const response = await fetch(`./version.json?t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          setNewVersion(data.version ?? '')
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der neuen Version:', error)
      }
    },
    onOfflineReady() {},
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleUpdate = () => {
    // Vor Update: lokale Daten sichern
    exportDecks()
    setTimeout(() => {
      updateServiceWorker(true)
    }, 100)
    setNewVersion('')
  }

  const handleDismiss = () => setNewVersion('')

  return (
    <div className="App">
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

        {/* Öffentlich zugängliche Info-Seiten */}
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/lizenzen" element={<LizenzenPage />} />

        {/* Fallback auf Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Footer mit SPA-Links */}
      <footer className="app-footer">
        <span>© {new Date().getFullYear()} [Name der Schule]</span>
        <nav>
          <Link to="/impressum">Impressum</Link>
          <Link to="/lizenzen">Lizenzen</Link>
        </nav>
      </footer>

      {/* Update-Hinweis nur anzeigen, wenn neue Version erkannt wurde */}
      {newVersion && (
        <UpdateNotification
          onUpdate={handleUpdate}
          onDismiss={handleDismiss}
          currentVersion={currentVersion}
          newVersion={newVersion}
        />
      )}
    </div>
  )
}

export default App
