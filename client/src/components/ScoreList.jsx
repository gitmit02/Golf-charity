export default function ScoreList({ scores }) {
  if (!scores || scores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl mb-4 animate-bounce">
          🏌️
        </div>
        <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest">No Rounds Logged</h3>
        <p className="text-slate-400 text-xs font-medium mt-2 text-center max-w-[200px]">
          Your performance history will appear here once you log your first round.
        </p>
      </div>
    )
  }

  // Calculate the lowest score (Best in Golf)
  const best = Math.min(...scores.map(s => s.score ?? s))

  return (
    <div className="relative space-y-3">
      {/* Decorative timeline line */}
      <div className="absolute left-[26px] top-4 bottom-4 w-0.5 bg-slate-100 hidden sm:block" />

      {scores.map((item, idx) => {
        const s = item.score ?? item
        const d = item.date ?? null
        const isBest = s === best

        return (
          <div
            key={idx}
            className={`group relative flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300
              ${isBest
                ? 'bg-emerald-50/50 border-emerald-200 shadow-lg shadow-emerald-100/20 z-10 scale-[1.02]'
                : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'
              }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              {/* Rank Badge */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black tracking-tighter shadow-sm transition-transform group-hover:scale-110
                ${isBest ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                #{idx + 1}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm uppercase tracking-tight">
                    Round Result
                  </span>
                  {isBest && (
                    <span className="flex items-center gap-1 text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-md uppercase tracking-widest animate-pulse">
                      Record ⭐
                    </span>
                  )}
                </div>
                {d && (
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">
                    {new Date(d).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              {/* Score Value with Visual Difficulty Indicator */}
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-0.5">Strokes</p>
                <span className={`text-2xl font-mono font-black tabular-nums leading-none
                  ${s <= 25 ? 'text-emerald-500' : s <= 32 ? 'text-blue-500' : 'text-orange-500'}`}>
                  {s}
                </span>
              </div>
              
              {/* Performance Pill */}
              <div className={`hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border
                ${s <= 25 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                  s <= 32 ? 'bg-blue-50 border-blue-100 text-blue-600' : 
                  'bg-orange-50 border-orange-100 text-orange-600'}`}>
                {s <= 25 ? '🏆' : s <= 32 ? '📈' : '⛳'}
              </div>
            </div>
          </div>
        )
      })}

      <div className="pt-4 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Showing latest <span className="text-slate-900">{scores.length}</span> entries
        </p>
      </div>
    </div>
  )
}