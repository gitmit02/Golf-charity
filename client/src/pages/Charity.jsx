import { useEffect, useMemo, useState } from 'react'
import CharityCard from '../components/CharityCard'
import { apiRequest, getStoredUser, setSession } from '../lib/api'
import { mapCharity } from '../lib/mappers'
import { charities as fallbackCharities } from '../data/charities'

export default function Charity() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [impactStats, setImpactStats] = useState({
    totalDonated: 0,
    charityCount: 0,
    userImpactPercent: 15,
  })

  useEffect(() => {
    const loadCharities = async () => {
      try {
        const [charityData, statsData, profileData] = await Promise.all([
          apiRequest('/api/charities'),
          apiRequest('/api/user/public-stats'),
          apiRequest('/api/auth/profile'),
        ])

        const apiCharities = (charityData.charities || []).map(mapCharity)
        if (apiCharities.length > 0) {
          setCharities(apiCharities)
        } else {
          setCharities(
            fallbackCharities.map((c, index) =>
              mapCharity({ ...c, _id: String(c.id || index + 1) }, index)
            )
          )
        }

        const stats = statsData.stats || {}
        setImpactStats({
          totalDonated: Math.round(stats.estimatedTotalDonated || 0),
          charityCount: stats.charityCount || apiCharities.length || 0,
          userImpactPercent: 15,
        })

        const profileUser = profileData.user || {}
        if (profileUser.charity?._id) {
          setSelected(profileUser.charity._id)
        }
      } catch {
        setCharities(
          fallbackCharities.map((c, index) =>
            mapCharity({ ...c, _id: String(c.id || index + 1) }, index)
          )
        )
      } finally {
        setLoading(false)
      }
    }
    loadCharities()
  }, [])

  const categories = useMemo(() => ['All', ...new Set(charities.map(c => c.category))], [charities])
  const filtered = filter === 'All' ? charities : charities.filter(c => c.category === filter)

  const handleSelect = (id) => {
    setSaveMessage('')
    setSelected(selected === id ? null : id)
  }

  const handleConfirm = async () => {
    if (!selected) return
    if (!/^[a-fA-F0-9]{24}$/.test(selected)) {
      setSaveMessage('This is fallback/local charity data. Add charities in Admin first, then save again.')
      return
    }

    try {
      setSaving(true)
      const data = await apiRequest('/api/user/charity', {
        method: 'POST',
        body: JSON.stringify({ charityId: selected }),
      })

      const currentUser = getStoredUser() || {}
      setSession({ user: { ...currentUser, ...(data.user || {}) } })
      setSaveMessage('Charity preference saved successfully.')
    } catch (err) {
      setSaveMessage(err.message || 'Unable to save charity preference.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="mt-4 text-sm font-semibold text-slate-600">Loading charities and impact data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Make an Impact
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Cause</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 font-medium leading-relaxed">
            15% of your subscription is donated directly to the charity you select.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 p-8 md:p-12 mb-16 shadow-2xl shadow-emerald-200/20">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-gray-800">
            <div className="text-center md:text-left md:px-8">
              <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-2">Total Donated</p>
              <h2 className="text-4xl md:text-5xl font-black text-white italic">Rs {impactStats.totalDonated.toLocaleString()}</h2>
              <p className="text-gray-500 text-xs mt-3 font-medium">Calculated from active subscriptions</p>
            </div>
            <div className="text-center md:text-left md:px-8">
              <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-2">Active Partners</p>
              <h2 className="text-4xl md:text-5xl font-black text-white italic">{String(impactStats.charityCount).padStart(2, '0')}</h2>
              <p className="text-gray-500 text-xs mt-3 font-medium">Verified non-profits</p>
            </div>
            <div className="text-center md:text-left md:px-8">
              <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-2">Your Impact</p>
              <h2 className="text-4xl md:text-5xl font-black text-white italic">{impactStats.userImpactPercent}%</h2>
              <p className="text-gray-500 text-xs mt-3 font-medium">Of every monthly entry</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h3 className="text-xl font-extrabold text-gray-900">Explore Categories</h3>
          <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  filter === cat
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(charity => (
            <div
              key={charity._id}
              className={`relative group transition-all duration-500 ${selected === charity._id ? 'scale-[1.02]' : ''}`}
            >
              {selected === charity._id && (
                <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.2rem] blur opacity-30 animate-pulse"></div>
              )}

              <div className="relative">
                <CharityCard
                  charity={charity}
                  selected={selected === charity._id}
                  onSelect={() => handleSelect(charity._id)}
                />
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md animate-in slide-in-from-bottom-10 fade-in duration-500 z-50">
            <div className="bg-gray-900/95 backdrop-blur-md text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-2xl">
                  {charities.find(c => c._id === selected)?.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Selection Active</p>
                  <p className="font-bold text-sm truncate max-w-[180px]">
                    {charities.find(c => c._id === selected)?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={handleConfirm}
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-black transition-colors uppercase tracking-widest disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}

        {saveMessage && (
          <div className="fixed top-24 right-6 z-50 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg">
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  )
}
