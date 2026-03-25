import { useEffect, useState } from 'react'
import WinnerCard from '../components/WinnerCard'
import { apiRequest } from '../lib/api'
import { mapCharity } from '../lib/mappers'

export default function AdminDashboard() {
  const [drawNumbers, setDrawNumbers] = useState(null)
  const [drawRunning, setDrawRunning] = useState(false)
  const [winners, setWinners] = useState([])
  const [users, setUsers] = useState([])
  const [charities, setCharities] = useState([])
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalSubscribers: 0, totalCharityContribution: 0 })
  const [activeSection, setActiveSection] = useState('users')
  const [charityForm, setCharityForm] = useState({ name: '', description: '' })
  const [savingCharity, setSavingCharity] = useState(false)
  const [charityMessage, setCharityMessage] = useState('')

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [usersData, charitiesData, analyticsData, winnersData] = await Promise.all([
          apiRequest('/api/user/admin/users'),
          apiRequest('/api/charities'),
          apiRequest('/api/user/admin/analytics'),
          apiRequest('/api/user/admin/winners'),
        ])

        setUsers(usersData.users || [])
        setCharities((charitiesData.charities || []).map(mapCharity))
        setAnalytics(analyticsData.analytics || { totalUsers: 0, totalSubscribers: 0, totalCharityContribution: 0 })

        const mappedWinners = (winnersData.winners || []).map((winner, index) => ({
          id: winner._id || index,
          name: winner.name,
          matches: 0,
          prize: winner.winnings || 0,
          matchType: 'Winner',
        }))
        setWinners(mappedWinners)
      } catch {
        setUsers([])
      }
    }

    loadAdminData()
  }, [])

  const handleCharityInput = (e) => {
    setCharityForm({ ...charityForm, [e.target.name]: e.target.value })
    setCharityMessage('')
  }

  const handleCreateCharity = async (e) => {
    e.preventDefault()
    setCharityMessage('')

    if (!charityForm.name.trim() || !charityForm.description.trim()) {
      setCharityMessage('Name and description are required.')
      return
    }

    try {
      setSavingCharity(true)
      const data = await apiRequest('/api/charities', {
        method: 'POST',
        body: JSON.stringify({
          name: charityForm.name.trim(),
          description: charityForm.description.trim(),
        }),
      })

      const created = data.charity ? mapCharity(data.charity, charities.length) : null
      if (created) {
        setCharities(prev => [created, ...prev])
      }
      setCharityForm({ name: '', description: '' })
      setCharityMessage('Charity created successfully.')
    } catch (err) {
      setCharityMessage(err.message || 'Failed to create charity.')
    } finally {
      setSavingCharity(false)
    }
  }

  const handleRunDraw = async () => {
    try {
      setDrawRunning(true)
      setDrawNumbers(null)

      const data = await apiRequest('/api/draw/run', {
        method: 'POST',
      })

      const draw = data.draw || {}
      setDrawNumbers(draw.numbers || [])

      const computed = (draw.winners || []).map((winner, index) => ({
        id: winner.userId?._id || index,
        name: winner.userId?.name || 'Anonymous',
        matches: Number((winner.matchType || '').split(' ')[0]) || 0,
        prize: winner.prize || 0,
        matchType: winner.matchType,
      }))

      setWinners(computed)
    } finally {
      setDrawRunning(false)
    }
  }

  const navItems = [
    { id: 'users', label: 'User Directory', icon: 'USR' },
    { id: 'draw', label: 'Draw Center', icon: 'DRW' },
    { id: 'charities', label: 'Charity Partners', icon: 'CHR' },
  ]

  const activeUsersCount = analytics.totalSubscribers || users.filter(u => u.subscriptionStatus === 'active').length
  const totalRevenue = activeUsersCount * 9.99

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider">ADMIN</span>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Management Console</h1>
              </div>
              <p className="text-sm text-gray-500 font-medium">System status: <span className="text-emerald-500">All systems operational</span></p>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeSection === item.id
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Platform Users', value: users.length, icon: 'U', bg: 'bg-blue-50' },
            { label: 'Active Subs', value: activeUsersCount, icon: 'A', bg: 'bg-emerald-50' },
            { label: 'Est. Revenue', value: `Rs ${totalRevenue.toFixed(0)}`, icon: 'R', bg: 'bg-amber-50' },
            { label: 'Active Charities', value: charities.length, icon: 'C', bg: 'bg-rose-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} text-xl`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
          {activeSection === 'users' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900">Registered Supporters</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Supporter</th>
                      <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Scores</th>
                      <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Supporting</th>
                      <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Winnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(user => (
                      <tr key={user._id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-5">
                          <div className="font-bold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </td>
                        <td>
                          {user.subscriptionStatus === 'active'
                            ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-700">ACTIVE</span>
                            : <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-gray-100 text-gray-500">INACTIVE</span>
                          }
                        </td>
                        <td>
                          <div className="flex gap-1">
                            {(user.scores || []).map((item, i) => (
                              <span key={i} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">{item.score}</span>
                            ))}
                          </div>
                        </td>
                        <td className="text-sm font-medium text-gray-600">
                          {user.charity?.name || '-'}
                        </td>
                        <td className="py-5 text-right font-black text-emerald-600">Rs {user.winnings || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'draw' && (
            <div className="p-12 text-center">
              <div className="max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 text-2xl mb-6 shadow-inner">DRAW</div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Monthly Grand Draw</h2>
                <p className="text-gray-500 font-medium mb-10">Run the official backend draw for active subscribers.</p>

                {drawNumbers ? (
                  <div className="mb-12 animate-in zoom-in duration-300">
                    <div className="flex justify-center gap-4 mb-8">
                      {drawNumbers.map((n, i) => (
                        <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-3xl font-black shadow-xl shadow-emerald-200 border-4 border-white">
                          {n}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-left">
                      <h3 className="font-bold text-gray-900 px-2">Prize Recipients ({winners.length})</h3>
                      {winners.map((w) => <WinnerCard key={w.id} winner={w} />)}
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={handleRunDraw}
                  disabled={drawRunning}
                  className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-gray-900 text-white font-black text-lg hover:bg-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-gray-200"
                >
                  {drawRunning ? 'COMPUTING RESULTS...' : 'LAUNCH DRAW NOW'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'charities' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900">Partner Impact</h2>
              </div>
              <form onSubmit={handleCreateCharity} className="mb-8 bg-slate-50 border border-slate-100 rounded-3xl p-6">
                <h3 className="text-lg font-extrabold text-slate-900 mb-4">Create Charity Partner</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="name"
                    value={charityForm.name}
                    onChange={handleCharityInput}
                    placeholder="Charity name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <input
                    name="description"
                    value={charityForm.description}
                    onChange={handleCharityInput}
                    placeholder="Short description"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className={`text-sm font-semibold ${charityMessage.includes('success') ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {charityMessage}
                  </p>
                  <button
                    type="submit"
                    disabled={savingCharity}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-black hover:bg-emerald-500 disabled:opacity-70"
                  >
                    {savingCharity ? 'Creating...' : 'Add Charity'}
                  </button>
                </div>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {charities.length === 0 && (
                  <div className="md:col-span-2 text-center border-2 border-dashed border-slate-200 rounded-3xl py-10 text-slate-500 font-semibold">
                    No charity partners yet. Create your first partner above.
                  </div>
                )}
                {charities.map(c => {
                  const supporters = users.filter(u => u.charity?._id === c._id).length
                  return (
                    <div key={c._id} className="p-6 rounded-3xl border border-gray-100 bg-slate-50/50 hover:bg-white transition-all hover:shadow-lg group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl">{c.icon}</div>
                        <div>
                          <h3 className="font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{c.name}</h3>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{c.category}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                        <div>
                          <p className="text-xl font-black text-gray-900">{supporters}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Fans</p>
                        </div>
                        <div>
                          <p className="text-xl font-black text-emerald-600">Rs {(supporters * 1.5).toFixed(0)}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">This Mo.</p>
                        </div>
                        <div>
                          <p className="text-xl font-black text-amber-500">{Math.round((c.raised / c.goal) * 100)}%</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">To Goal</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
