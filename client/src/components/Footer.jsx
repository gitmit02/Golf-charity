import { Link } from 'react-router-dom'
import { getStoredUser, getToken } from '../lib/api'

export default function Footer() {
  const token = getToken()
  const user = getStoredUser()
  const isAdmin = Boolean(token) && user?.role === 'admin'
  const links = isAdmin
    ? [
        { name: 'Home', path: '/' },
        { name: 'Admin Portal', path: '/admin' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Charities', path: '/charity' },
        { name: 'Draw Results', path: '/results' },
      ]

  return (
    <footer className="bg-[#0F172A] border-t border-slate-800/50 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand & Mission - Takes 5 cols */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-emerald-500 opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
                <div className="relative w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shadow-lg">
                  <span className="text-xl">⛳</span>
                </div>
              </div>
              <span className="font-black text-white text-xl tracking-tighter uppercase">
                Golf<span className="text-emerald-500">Charity</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              We're bridging the gap between weekend golf and global impact. Every round you log contributes directly to life-changing causes.
            </p>
            <div className="flex gap-4">
              {['𝕏', '📷', '📘', '💼'].map((social, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation - Takes 3 cols */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6">Platform</h4>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-slate-400 hover:text-white font-bold text-sm transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 mr-0 group-hover:mr-2 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support - Takes 4 cols */}
          <div className="md:col-span-4 bg-slate-800/30 p-8 rounded-[2rem] border border-slate-800/50">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6">Direct Support</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">📧</div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Email Us</p>
                  <p className="text-sm font-bold text-slate-200">hq@golfcharity.com</p>
                </div>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">📞</div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Direct Line</p>
                  <p className="text-sm font-bold text-slate-200">+44 (0) 20 555-GOLF</p>
                </div>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">📍</div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Office</p>
                  <p className="text-sm font-bold text-slate-200">St. Andrews, Scotland</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-800/80">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© 2026 GolfCharity HQ</span>
            <div className="flex gap-6">
              <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors">Privacy</a>
              <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors">Terms</a>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">System Version 2.4.0-Stable</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
