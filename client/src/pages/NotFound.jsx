import { Link } from 'react-router-dom'
import { getStoredUser, getToken } from '../lib/api'

function getHomeRoute() {
  const token = getToken()
  const user = getStoredUser()
  if (!token) return '/login'
  return user?.role === 'admin' ? '/admin' : '/dashboard'
}

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-12rem)] bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl relative overflow-hidden rounded-[3rem] bg-slate-900 text-white p-10 md:p-14 shadow-2xl shadow-emerald-900/20">
        <div className="absolute -top-16 -right-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-[110px]" />

        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-black uppercase tracking-[0.2em]">
            Route Not Found
          </p>

          <div className="mt-8 flex items-end gap-3">
            <h1 className="text-7xl md:text-8xl font-black leading-none tracking-tighter text-white/95">404</h1>
            <span className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Error</span>
          </div>

          <h2 className="mt-6 text-3xl md:text-4xl font-black tracking-tight">
            This hole has no fairway.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300 font-medium leading-relaxed">
            The page you tried to open does not exist, was moved, or the link is outdated.
            Use the buttons below to get back to live routes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to={getHomeRoute()}
              className="px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider text-center transition-all hover:scale-[1.02]"
            >
              Go To Dashboard
            </Link>
            <Link
              to="/home"
              className="px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-black text-sm uppercase tracking-wider text-center transition-colors"
            >
              Visit Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

