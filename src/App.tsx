import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import DeckPage from './pages/DeckPage/DeckPage';
import './App.css';
import LearningPage from './pages/LearningPage/LearningPage';

function App() {
  const { theme } = useTheme();

  // 2. Dieser Hook wird hinzugefügt
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 3. Der umschließende <div>-Container wird entfernt
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
            <Route path="/learn/:deckId" element={<LearningPage />} /> {/* NEUE ROUTE */}
    </Routes>
  );
}

export default App;