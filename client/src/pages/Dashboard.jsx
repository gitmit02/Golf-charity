import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ScoreForm from '../components/ScoreForm'
import ScoreList from '../components/ScoreList'
import SubscriptionCard from '../components/SubscriptionCard'
import { apiRequest, getStoredUser, setSession } from '../lib/api'
import { mapCharity } from '../lib/mappers'

const plans = [
  {
    plan: 'monthly',
    price: 9.99,
    period: 'month',
    features: ['Monthly prize draw entry', 'Submit up to 5 scores', 'Charity contribution (15%)'],
  },
  {
    plan: 'yearly',
    price: 89.99,
    period: 'year',
    popular: true,
    features: ['All Monthly features', '2 bonus draw entries', 'Save Rs 30 vs monthly'],
  },
]

export default function Dashboard() {
  const storedUser = getStoredUser()
  const [user, setUser] = useState(storedUser || { name: 'Player' })
  const [scores, setScores] = useState([])
  const [charities, setCharities] = useState([])
  const [daysToDraw, setDaysToDraw] = useState('--')
  const [selectedCharityId, setSelectedCharityId] = useState('')
  const [showScoreForm, setShowScoreForm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const selectedCharity = useMemo(
    () => charities.find(c => c._id === selectedCharityId) || null,
    [charities, selectedCharityId]
  )

  useEffect(() => {
    let mounted = true

    const loadDashboard = async () => {
      try {
        const [dashboardData, scoreData, charityData, profileData, drawMetaData] = await Promise.all([
          apiRequest('/api/user/dashboard'),
          apiRequest('/api/scores'),
          apiRequest('/api/charities'),
          apiRequest('/api/auth/profile'),
          apiRequest('/api/draw/meta'),
        ])

        const dashboard = dashboardData.data || {}
        const profileUser = profileData.user || {}

        const mergedUser = {
          ...(storedUser || {}),
          ...profileUser,
          subscriptionStatus: dashboard.subscriptionStatus || profileUser.subscriptionStatus,
          subscriptionType: dashboard.subscriptionType || profileUser.subscriptionType,
          winnings: dashboard.winnings ?? profileUser.winnings ?? 0,
        }

        if (!mounted) return
        setSession({ user: mergedUser })
        setUser(mergedUser)
        setScores(scoreData.scores || dashboard.scores || [])

        const mappedCharities = (charityData.charities || []).map(mapCharity)
        setCharities(mappedCharities)
        setDaysToDraw(String(drawMetaData.meta?.daysToDraw ?? '--'))

        const charityId = dashboard.charity?._id || profileUser.charity?._id || ''
        setSelectedCharityId(charityId)
      } catch {
        if (!mounted) return
        setScores([])
      }
    }

    loadDashboard()
    const onFocus = () => loadDashboard()
    window.addEventListener('focus', onFocus)
    const intervalId = setInterval(loadDashboard, 15000)

    return () => {
      mounted = false
      window.removeEventListener('focus', onFocus)
      clearInterval(intervalId)
    }
  }, [])

  const handleAddScore = async (newScore) => {
    try {
      const data = await apiRequest('/api/scores/add', {
        method: 'POST',
        body: JSON.stringify({ score: Number(newScore.score) }),
      })
      setScores(data.scores || [])
      setShowScoreForm(false)
    } catch {
      // Keep form open if request fails.
    }
  }

  const handleSubscribe = async (plan) => {
    try {
      const data = await apiRequest('/api/user/subscription', {
        method: 'POST',
        body: JSON.stringify({
          subscriptionType: plan,
          charityId: selectedCharityId || undefined,
        }),
      })

      const updatedUser = {
        ...user,
        subscriptionStatus: data.user?.subscriptionStatus || 'active',
        subscriptionType: data.user?.subscriptionType || plan,
      }
      setUser(updatedUser)
      setSession({ user: updatedUser })
    } catch {
      // no-op for now
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'OV' },
    { id: 'scores', label: 'My Scores', icon: 'SC' },
    { id: 'subscription', label: 'Plan', icon: 'PL' },
    { id: 'charity', label: 'Impact', icon: 'IM' },
  ]

  const subscriptionActive = user.subscriptionStatus === 'active'

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-slate-200 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Hey, {(user.name || 'Player').split(' ')[0]}!
              </h1>
              <p className="text-slate-500 font-medium text-lg">
                Your current handicap is looking <span className="text-emerald-600 font-bold underline decoration-emerald-200">strong</span> this month.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              {subscriptionActive ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-200">
                  PRO MEMBER
                </div>
              ) : (
                <button onClick={() => setActiveTab('subscription')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-black transition-transform active:scale-95">
                  UPGRADE NOW
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-10 overflow-x-auto pb-2 scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105'
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Winnings', value: `Rs ${user.winnings || 0}`, color: 'bg-amber-500', icon: 'W' },
                { label: 'Current Plan', value: user.subscriptionType || 'Free', color: 'bg-blue-500', icon: 'P' },
                { label: 'Active Scores', value: scores.length, color: 'bg-emerald-500', icon: 'S' },
                { label: 'Days to Draw', value: daysToDraw, color: 'bg-violet-500', icon: 'D' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                  <div className={`${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center text-xl mb-4 shadow-inner text-white font-bold`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 capitalize">{stat.value}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 italic">Recent Rounds</h2>
                    <button
                      onClick={() => setShowScoreForm(true)}
                      className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl shadow-lg shadow-emerald-100 hover:rotate-90 transition-transform"
                    >
                      +
                    </button>
                  </div>

                  {showScoreForm ? (
                    <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 mb-6">
                      <ScoreForm onAddScore={handleAddScore} onCancel={() => setShowScoreForm(false)} />
                    </div>
                  ) : (
                    <ScoreList scores={scores} />
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                  <h3 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-6">Your Chosen Impact</h3>
                  {selectedCharity ? (
                    <div className="space-y-4">
                      <div className="text-4xl">{selectedCharity.icon}</div>
                      <h4 className="text-xl font-bold leading-tight">{selectedCharity.name}</h4>
                      <p className="text-emerald-100/70 text-sm leading-relaxed">{selectedCharity.description?.slice(0, 100)}...</p>
                      <Link to="/charity" className="inline-block pt-4 text-emerald-400 font-bold text-sm hover:underline">Change Charity -&gt;</Link>
                    </div>
                  ) : (
                    <Link to="/charity" className="block text-center p-4 border-2 border-dashed border-emerald-700 rounded-3xl hover:bg-emerald-800 transition-colors font-bold">
                      Pick a Charity
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Level Up Your Game</h2>
              <p className="text-slate-500 font-medium">Choose a plan to enter the draw and maximize your charity impact.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {plans.map(p => (
                <div key={p.plan} onClick={() => handleSubscribe(p.plan)} className="group cursor-pointer">
                  <SubscriptionCard {...p} selected={user.subscriptionType === p.plan} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scores' && (
          <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-slate-900 italic underline decoration-emerald-400">Score History</h2>
              <button onClick={() => setShowScoreForm(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm">
                + NEW SCORE
              </button>
            </div>
            {showScoreForm ? (
              <ScoreForm onAddScore={handleAddScore} onCancel={() => setShowScoreForm(false)} />
            ) : (
              <ScoreList scores={scores} />
            )}
          </div>
        )}

        {activeTab === 'charity' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-3xl font-black text-slate-900 mb-3">Your Impact</h2>
              <p className="text-slate-500 font-medium mb-8">
                This tab shows the cause tied to your account.
              </p>

              {selectedCharity ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 md:p-8">
                  <div className="text-4xl mb-4">{selectedCharity.icon}</div>
                  <h3 className="text-2xl font-black text-slate-900">{selectedCharity.name}</h3>
                  <p className="text-slate-600 mt-3 leading-relaxed">
                    {selectedCharity.description || 'No description available for this charity yet.'}
                  </p>
                  <Link
                    to="/charity"
                    className="inline-block mt-6 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm"
                  >
                    Change Charity
                  </Link>
                </div>
              ) : (
                <div className="text-center border-2 border-dashed border-slate-200 rounded-3xl p-10">
                  <p className="text-slate-600 font-medium mb-5">
                    You have not selected a charity yet.
                  </p>
                  <Link
                    to="/charity"
                    className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm"
                  >
                    Pick a Charity
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
