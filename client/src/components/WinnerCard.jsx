export default function WinnerCard({ winner }) {
  const prizeByMatches = {
    5: { label: 'Jackpot', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    4: { label: 'Gold', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    3: { label: 'Silver', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
    2: { label: 'Bronze', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    1: { label: 'Entry', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  }

  const tier = prizeByMatches[winner.matches] || {
    label: winner.matchType || 'Winner',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  }

  return (
    <div className={`card border-2 ${tier.border} ${tier.bg} flex flex-col sm:flex-row sm:items-center gap-4`}>
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
        {(winner.name || 'W').charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{winner.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">
          Matched <span className="font-bold text-primary-600">{winner.matches || 0}</span> numbers
          {winner.matchedNumbers?.length ? (
            <span className="ml-1 text-gray-400">({winner.matchedNumbers.join(', ')})</span>
          ) : null}
        </p>
      </div>

      <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white border ${tier.border} ${tier.color}`}>
          {tier.label}
        </span>
        <span className={`font-display font-bold text-xl ${tier.color}`}>
          Rs {(winner.prize || 0).toLocaleString()}
        </span>
      </div>
    </div>
  )
}
