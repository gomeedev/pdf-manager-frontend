import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import { PrivateRoute } from '@/components/layout/PrivateRoute'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'

function IndexRedirect() {
  const { user, loading } = useAuth()

  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<IndexRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
