import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest, setSession } from '../lib/api'
import { charities as fallbackCharities } from '../data/charities'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ name: '', email: '', password: '', charityId: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [charities, setCharities] = useState([])

  useEffect(() => {
    const loadCharities = async () => {
      try {
        const data = await apiRequest('/api/charities')
        const apiCharities = (data.charities || []).map((c, index) => ({
          ...c,
          _id: c._id || String(c.id || index + 1),
          name: c.name || `Charity ${index + 1}`,
        }))

        if (apiCharities.length > 0) {
          setCharities(apiCharities)
          return
        }

        setCharities(
          fallbackCharities.map((c, index) => ({
            ...c,
            _id: String(c.id || index + 1),
          }))
        )
      } catch {
        setCharities(
          fallbackCharities.map((c, index) => ({
            ...c,
            _id: String(c.id || index + 1),
          }))
        )
      }
    }
    loadCharities()
  }, [])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your full name'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (form.password.length < 6) e.password = 'Security requires at least 6 characters'
    if (!form.charityId) e.charityId = 'Selecting a cause is required to join'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    try {
      setLoading(true)
      const registerData = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      })

      setSession({ token: registerData.token, user: registerData.user })

      // Set initial subscription and selected charity right after signup.
      const subscriptionPayload = { subscriptionType: 'monthly' }
      if (/^[a-fA-F0-9]{24}$/.test(form.charityId)) {
        subscriptionPayload.charityId = form.charityId
      }

      await apiRequest('/api/user/subscription', {
        method: 'POST',
        body: JSON.stringify(subscriptionPayload),
      })

      navigate('/dashboard')
    } catch (err) {
      setSubmitError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden font-sans py-20 px-4">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] rounded-full bg-emerald-100/40 blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-blue-100/40 blur-[100px]" />
      </div>

      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="group inline-flex relative mb-6">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 opacity-25 blur transition duration-300 group-hover:opacity-40"></div>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
              <span className="text-3xl">🌟</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Join the Club</h1>
          <p className="text-gray-500 font-medium italic">Play for the green, give for the good.</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-emerald-900/5 border border-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="mb-2 flex animate-shake items-start gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
                <span className="mt-0.5">⚠️</span>
                <p className="font-medium leading-relaxed">{submitError}</p>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="name">Full Name</label>
              <input
                id="name" name="name" type="text"
                value={form.name} onChange={handleChange}
                placeholder="Tiger Woods"
                className={`w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-4 text-gray-900 transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none placeholder:text-gray-300 ${errors.name ? 'border-red-200 bg-red-50/30' : ''}`}
              />
              {errors.name && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-2">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="tiger@golf.com"
                className={`w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-4 text-gray-900 transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none placeholder:text-gray-300 ${errors.email ? 'border-red-200 bg-red-50/30' : ''}`}
              />
              {errors.email && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-2">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-4 text-gray-900 transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none pr-12 placeholder:text-gray-300 ${errors.password ? 'border-red-200 bg-red-50/30' : ''}`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl grayscale hover:grayscale-0 transition-all active:scale-90"
                >
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-2">{errors.password}</p>}
            </div>

            {/* Charity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="charityId">Support a Cause</label>
              <select
                id="charityId" name="charityId"
                value={form.charityId} onChange={handleChange}
                className={`w-full appearance-none rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-4 text-gray-900 transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none cursor-pointer ${errors.charityId ? 'border-red-200 bg-red-50/30' : ''}`}
              >
                <option value="" disabled className="text-gray-400">Select your impact partner...</option>
                {charities.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id} className="text-slate-900">{c.name}</option>
                ))}
              </select>
              {errors.charityId && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-2">{errors.charityId}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-2xl bg-emerald-600 px-6 py-5 font-black text-white shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70 mt-4 tracking-widest"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>PREPARING YOUR PROFILE...</span>
                  </>
                ) : (
                  <>
                    <span>CREATE MY ACCOUNT</span>
                    <span className="text-xl transition-transform group-hover:translate-x-1">🚀</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400 font-bold mt-10">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4 decoration-2 transition-all">
              Sign In →
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
          Secured with Industry Standard Encryption
        </p>
      </div>
    </div>
  )
}
