import React, { useEffect } from 'react'; // <-- 1. Hinzugefügt
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import DeckPage from './pages/DeckPage/DeckPage';
import './App.css';

function App() {
  const { theme } = useTheme();

  // 2. Dieser Hook wird hinzugefügt
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 3. Der umschließende <div>-Container wird entfernt
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
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
    </Routes>
  );
}

export default App;