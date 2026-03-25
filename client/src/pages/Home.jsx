import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CharityCard from '../components/CharityCard'
import { apiRequest } from '../lib/api'
import { mapCharity } from '../lib/mappers'

const steps = [
  { icon: 'PAY', title: 'Subscribe', desc: 'Join with a monthly or yearly plan in under 60 seconds.' },
  { icon: 'GLF', title: 'Log Rounds', desc: 'Enter your last 5 scores from any course you play.' },
  { icon: 'DRW', title: 'Monthly Draw', desc: 'Your performance enters you into our exclusive prize pools.' },
  { icon: 'GIV', title: 'Fund Change', desc: '15% of your entry fee goes directly to your chosen cause.' },
]

export default function Home() {
  const [charities, setCharities] = useState([])
  const [stats, setStats] = useState([
    { value: 'Rs 0', label: 'Total Donated' },
    { value: '0', label: 'Pro Members' },
    { value: 'Rs 0', label: 'Monthly Pot' },
    { value: '00', label: 'Charities' },
  ])

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [charityData, publicStatsData, drawMetaData] = await Promise.all([
          apiRequest('/api/charities'),
          apiRequest('/api/user/public-stats'),
          apiRequest('/api/draw/meta'),
        ])

        const mappedCharities = (charityData.charities || []).map(mapCharity)
        setCharities(mappedCharities)

        const apiStats = publicStatsData.stats || {}
        const drawMeta = drawMetaData.meta || {}
        setStats([
          { value: `Rs ${Math.round(apiStats.estimatedTotalDonated || 0).toLocaleString()}`, label: 'Total Donated' },
          { value: String(apiStats.totalSubscribers || 0), label: 'Pro Members' },
          { value: `Rs ${Math.round(drawMeta.monthlyPot || 0).toLocaleString()}`, label: 'Monthly Pot' },
          { value: String(apiStats.charityCount || 0).padStart(2, '0'), label: 'Charities' },
        ])
      } catch {
        setCharities([])
      }
    }

    loadHomeData()
  }, [])

  return (
    <div className="bg-white">
      <section className="relative pt-20 pb-32 overflow-hidden bg-[#0F172A]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-400 mb-8 tracking-widest uppercase">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Season 2026 Now Live
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8">
            PLAY FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">SCORE.</span><br />
            WIN FOR <span className="italic font-serif text-emerald-400 underline decoration-white/20">CHANGE.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12">
            The golf performance platform where your handicap helps fund charities while you compete for monthly jackpots.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-10 py-5 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 text-lg">
              START WINNING NOW
            </Link>
            <Link to="/charity" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold px-10 py-5 rounded-2xl border border-slate-700 transition-all">
              VIEW CAUSES
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="py-6 px-4">
                <div className="text-3xl font-black text-white mb-1 tracking-tight">{s.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
            <div className="max-w-xl">
              <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">The Blueprint</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Simple process, <span className="text-slate-400">massive impact.</span></h3>
            </div>
            <p className="text-slate-500 font-medium max-w-sm">We automated the bridge between your round and charity funding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="group relative p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                <div className="absolute top-6 right-8 text-6xl font-black text-slate-200/50 italic group-hover:text-emerald-500/10 transition-colors">0{i + 1}</div>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sm font-black shadow-sm mb-8 group-hover:scale-110 transition-transform">{s.icon}</div>
                <h4 className="text-xl font-black text-slate-900 mb-3">{s.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black text-slate-900 mb-4">Partner Charities</h3>
            <div className="h-1.5 w-20 bg-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {charities.slice(0, 3).map(c => (
              <CharityCard key={c._id} charity={c} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/charity" className="text-slate-900 font-black hover:text-emerald-600 transition-colors flex items-center justify-center gap-2">
              VIEW ALL {charities.length || 0} PARTNERS <span className="text-xl">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
