import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearSession, getStoredUser, getToken } from '../lib/api'

const baseNavLinks = [
  { to: '/home',          label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/charity',   label: 'Charities' },
  { to: '/results',   label: 'Results' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const token = getToken()
  const user = getStoredUser()
  const isAdmin = Boolean(token) && user?.role === 'admin'
  const navLinks = isAdmin
    ? [
        { to: '/home', label: 'Home' },
        { to: '/admin', label: 'Admin' },
      ]
    : baseNavLinks

  // Change navbar opacity on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleAuthAction = () => {
    if (token) {
      clearSession()
      setMenuOpen(false)
      navigate('/login')
      return
    }
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <nav 
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm py-2' 
          : 'bg-white/0 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
              <div className="relative w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <span className="text-xl">⛳</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <span className="block font-black text-slate-900 text-lg leading-none tracking-tighter uppercase">
                Golf<span className="text-emerald-500">Charity</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">Impact Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-5 py-2 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-wider
                  ${isActive(link.to)
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA & Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleAuthAction}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              {token ? 'SIGN OUT' : 'SIGN IN'}
            </button>
            
            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-200 transition-all duration-300 ease-in-out ${
          menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-4 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-5 py-4 rounded-2xl text-sm font-black transition-all
                ${isActive(link.to)
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center justify-between">
                {link.label}
                {isActive(link.to) && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
              </div>
            </Link>
          ))}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleAuthAction}
              className="block w-full text-center py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-200"
            >
              {token ? 'SIGN OUT' : 'SIGN IN TO ACCOUNT'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
