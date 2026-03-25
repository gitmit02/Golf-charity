import { useEffect, useState } from 'react'
import WinnerCard from '../components/WinnerCard'
import { apiRequest } from '../lib/api'

const fallbackTiers = {
  5: { label: 'Jackpot', prize: 10000, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  4: { label: 'Gold', prize: 2500, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  3: { label: 'Silver', prize: 500, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
}

export default function Results() {
  const [drawNumbers, setDrawNumbers] = useState([])
  const [activeMonth, setActiveMonth] = useState('Latest Draw')
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDraw = async () => {
      try {
        const data = await apiRequest('/api/draw/latest')
        const draw = data.draw || {}
        setDrawNumbers(draw.numbers || [])
        setActiveMonth(new Date(draw.date || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))

        const mappedWinners = (draw.winners || []).map((winner, index) => {
          const matched = Number((winner.matchType || '').split(' ')[0]) || 0
          return {
            id: winner.userId?._id || index,
            name: winner.userId?.name || 'Anonymous',
            email: winner.userId?.email || '',
            matches: matched,
            matchType: winner.matchType,
            prize: winner.prize,
          }
        })

        setWinners(mappedWinners)
      } catch {
        setDrawNumbers([])
        setWinners([])
      } finally {
        setLoading(false)
      }
    }

    loadDraw()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 mb-12 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest mb-4">
            Official Draw Results
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            The <span className="text-emerald-600 italic">Winners</span> Circle
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">{activeMonth}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group overflow-hidden rounded-[3rem] bg-slate-900 p-10 md:p-16 mb-12 text-center shadow-2xl shadow-emerald-900/20">
          <p className="relative z-10 text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-10">
            Winning Ball Combination
          </p>

          <div className="relative z-10 flex justify-center gap-3 sm:gap-6 flex-wrap mb-12">
            {loading ? (
              <p className="text-slate-300">Loading latest draw...</p>
            ) : drawNumbers.length === 0 ? (
              <p className="text-slate-300">No draw has been published yet.</p>
            ) : (
              drawNumbers.map((n, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-white text-slate-900 text-2xl sm:text-3xl font-black shadow-[0_0_40px_rgba(255,255,255,0.15)] border-4 border-slate-800 animate-in zoom-in fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {n}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Prize Structure</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(fallbackTiers).reverse().map(([matches, tier]) => (
              <div key={matches} className={`group rounded-[2rem] border bg-white p-6 text-center transition-all hover:shadow-lg ${tier.border}`}>
                <div className={`text-xs font-black uppercase tracking-widest mb-3 ${tier.color}`}>{tier.label}</div>
                <div className="text-2xl font-black text-slate-900 mb-1">Rs {tier.prize.toLocaleString()}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {matches} Matches
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 italic">Prize Recipients</h2>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-black">{winners.length} TOTAL</span>
          </div>

          {winners.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-300 py-16 text-center">
              <p className="text-slate-400 font-bold">No winning combinations found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {winners.map((w) => (
                <WinnerCard key={w.id} winner={w} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
