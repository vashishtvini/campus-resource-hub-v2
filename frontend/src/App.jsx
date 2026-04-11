import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { BrowsePage } from './pages/BrowsePage'
import { UploadPage } from './pages/UploadPage'
import { isAuthed } from './lib/auth'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route
            path="/"
            element={isAuthed() ? <Navigate to="/browse" replace /> : <LandingPage />}
          />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
