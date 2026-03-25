import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Charity from './pages/Charity'
import Results from './pages/Results'
import AdminDashboard from './pages/AdminDashboard'
import ForgetPassword from './pages/ForgetPassword'
import NotFound from './pages/NotFound'
import { apiRequest, getStoredUser, getToken } from './lib/api'

function getDefaultRouteByRole() {
  const token = getToken()
  const user = getStoredUser()
  if (!token) return '/login'
  return user?.role === 'admin' ? '/admin' : '/dashboard'
}

function RequireUser({ children }) {
  const token = getToken()
  const user = getStoredUser()
  if (!token) return <Navigate to="/login" replace />
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  return children
}

function RequireAdmin({ children }) {
  const token = getToken()
  const user = getStoredUser()
  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function PublicOnly({ children }) {
  const token = getToken()
  if (token) return <Navigate to={getDefaultRouteByRole()} replace />
  return children
}

function RootRedirect() {
  return <Navigate to={getDefaultRouteByRole()} replace />
}

function App() {
  const [backendReady, setBackendReady] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    let timerId

    const checkBackend = async () => {
      try {
        await apiRequest('/api/charities', { method: 'GET' })
        if (!active) return
        setBackendReady(true)
        return
      } catch {
        // Keep retrying until backend is reachable.
      }

      if (!active) return
      setRetryCount((count) => count + 1)
      timerId = window.setTimeout(checkBackend, 1200)
    }

    checkBackend()
    return () => {
      active = false
      if (timerId) window.clearTimeout(timerId)
    }
  }, [])

  if (!backendReady) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="h-14 w-14 mx-auto animate-spin rounded-full border-4 border-emerald-300/30 border-t-emerald-400" />
          <h1 className="mt-6 text-2xl font-black tracking-tight">Starting GolfCharity...</h1>
          <p className="mt-2 text-sm text-slate-300 font-medium">
            Waiting for backend services to be ready.
          </p>
          <p className="mt-3 text-xs text-slate-500 font-semibold">
            Retry attempt: {retryCount}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 page-enter">
          <Routes>
            <Route path="/"          element={<RootRedirect />} />
            <Route path="/home"      element={<Home />} />
            <Route path="/login"     element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/forgot-password" element={<PublicOnly><ForgetPassword /></PublicOnly>} />
            <Route path="/signup"    element={<PublicOnly><Signup /></PublicOnly>} />
            <Route path="/dashboard" element={<RequireUser><Dashboard /></RequireUser>} />
            <Route path="/charity"   element={<RequireUser><Charity /></RequireUser>} />
            <Route path="/results"   element={<RequireUser><Results /></RequireUser>} />
            <Route path="/admin"     element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="*"          element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
