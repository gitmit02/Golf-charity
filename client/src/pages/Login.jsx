import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest, setSession } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      })

      setSession({ token: data.token, user: data.user })
      navigate(data.user?.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-100/50 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="w-full max-w-md px-6 py-12 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="group relative mb-6">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 opacity-30 blur transition duration-300 group-hover:opacity-50"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl ring-1 ring-gray-200/50 transition-transform hover:scale-105">
              <span className="text-4xl">G</span>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Back</span>
          </h1>
          <p className="mt-3 text-base text-gray-500 font-medium">
            Sign in to continue to GolfCharity
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-gray-200/50 border border-white">
          {error && (
            <div className="mb-6 flex animate-shake items-start gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
              <span className="mt-0.5">!</span>
              <p className="font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1" htmlFor="email">Email or Username</label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="name@company.com or your username"
                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-4 py-3.5 text-gray-900 transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="password"
                  className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-4 py-3.5 text-gray-900 transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none pr-12 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  {showPwd ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign Into Dashboard</span>
                    <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline underline-offset-4 decoration-2">
                Join the club
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 font-medium">
          &copy; 2026 GolfCharity Foundation. All rights reserved.
        </p>
      </div>
    </div>
  )
}
