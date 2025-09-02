import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
// Wir benennen den Import um, um Klarheit zu schaffen
import { version as currentVersion } from './version'

import { useTheme } from './context/ThemeContext'
import { useDecks } from './context/DeckContext'

import DashboardPage from './pages/DashboardPage/DashboardPage'
import DeckPage from './pages/DeckPage/DeckPage'
import LearningPage from './pages/LearningPage/LearningPage'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import UpdateNotification from './components/UpdateNotification/UpdateNotification'

import './App.css'

function App() {
  const { theme } = useTheme()
  const { exportDecks } = useDecks()

  // Dieser State steuert jetzt alles. Ist er leer, ist keine Benachrichtigung sichtbar.
  // Ist er gefüllt, enthält er die NEUE Version und die Benachrichtigung wird gezeigt.
  const [newVersion, setNewVersion] = useState('')

  const { updateServiceWorker } = useRegisterSW({
    // Diese Funktion wird jetzt asynchron, um die neue Version zu holen
    async onNeedRefresh() {
      try {
        // HIER IST DIE FINALE KORREKTUR: './' statt '/'
        const response = await fetch(`./version.json?t=${new Date().getTime()}`)
        if (response.ok) {
          const data = await response.json()
          // State mit der neuen Version setzen, was die Benachrichtigung auslöst
          setNewVersion(data.version)
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
    exportDecks()
    setTimeout(() => {
      updateServiceWorker(true)
    }, 100)
    // Benachrichtigung schließen
    setNewVersion('')
  }

  const handleDismiss = () => {
    // Benachrichtigung schließen
    setNewVersion('')
  }

  return (
    <>
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

      {/* Die Benachrichtigung wird angezeigt, wenn newVersion einen Wert hat */}
      {newVersion && (
        <UpdateNotification
          onUpdate={handleUpdate}
          onDismiss={handleDismiss}
          currentVersion={currentVersion}
          newVersion={newVersion}
        />
      )}
    </>
  )
}

export default App
