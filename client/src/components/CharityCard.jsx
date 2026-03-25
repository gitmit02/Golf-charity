export default function CharityCard({ charity, selected, onSelect, compact = false }) {
  const progress = Math.round((charity.raised / charity.goal) * 100)

  // --- COMPACT VIEW (Sidebar/Lists) ---
  if (compact) {
    return (
      <div
        onClick={() => onSelect && onSelect(charity.id)}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300 active:scale-[0.98]
          ${selected 
            ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100/20' 
            : 'border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/50'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl shadow-sm transition-transform group-hover:scale-110 ${selected ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>
            {charity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 truncate tracking-tight text-sm">
              {charity.name}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {charity.category}
            </p>
          </div>
          {selected && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg animate-in zoom-in">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    )
  }

  // --- FULL VIEW (Main Grid) ---
  return (
    <div className={`relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-8 transition-all duration-500 border-2
      ${selected 
        ? 'border-emerald-500 shadow-2xl shadow-emerald-100/40 scale-[1.02]' 
        : 'border-slate-100 shadow-xl shadow-slate-200/40 hover:border-emerald-200 hover:-translate-y-1'}`}>

      {/* Header Area */}
      <div className="flex items-start justify-between mb-6">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-inner transition-colors
          ${selected ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-50 text-slate-900'}`}>
          {charity.icon}
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors
          ${selected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {charity.category}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          {charity.name}
        </h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
          {charity.description}
        </p>
      </div>

      {/* Progress Section */}
      <div className="mb-8 p-5 rounded-3xl bg-slate-50/80 border border-slate-100">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fundraising</p>
            <p className="text-lg font-black text-slate-900 leading-none">
              ₹{charity.raised.toLocaleString()} <span className="text-slate-400 text-xs font-medium">₹{charity.goal.toLocaleString()}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-emerald-600 leading-none">{progress}%</p>
          </div>
        </div>

        {/* Improved Progress Bar */}
        <div className="relative h-3 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out
              ${selected ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          <span>{charity.supporters.toLocaleString()} BACKERS</span>
          <span>{progress}% FUNDED</span>
        </div>
      </div>

      {/* Action Button */}
      {onSelect && (
        <button
          onClick={() => onSelect(charity.id)}
          className={`group flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.97]
            ${selected
              ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
              : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'
            }`}
        >
          {selected ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Impact Selected
            </>
          ) : (
            'Select This Cause'
          )}
        </button>
      )}
    </div>
  )
}