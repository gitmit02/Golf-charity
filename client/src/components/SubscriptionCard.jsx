export default function SubscriptionCard({ plan, price, period, features, popular, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect && onSelect(plan)}
      className={`relative group flex flex-col h-full cursor-pointer overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 border-2
        ${selected
          ? 'border-emerald-500 bg-white shadow-2xl shadow-emerald-100 scale-[1.02] z-10'
          : popular
            ? 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xl hover:shadow-slate-200/50'
            : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-lg'
        }`}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-4 right-6">
          <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner transition-transform group-hover:scale-110
          ${popular ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-100'}`}>
          <span>{plan === 'monthly' ? '📅' : '🎯'}</span>
        </div>
        
        <h3 className="font-black text-slate-900 text-2xl capitalize tracking-tighter mb-1">
          {plan} <span className="text-slate-400 font-medium tracking-normal text-sm italic">Plan</span>
        </h3>
        
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-slate-900 tracking-tight">₹{price}</span>
          <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">/{period}</span>
        </div>
      </div>

      {/* Feature List */}
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors
              ${selected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className={selected ? 'text-slate-900 font-bold' : ''}>{f}</span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <button
        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.97] shadow-lg
          ${selected
            ? 'bg-emerald-500 text-white shadow-emerald-200'
            : popular
              ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
              : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-slate-900 hover:text-slate-900 shadow-slate-100'
          }`}
      >
        {selected ? '✓ Current Membership' : 'Select Plan'}
      </button>

      {/* Decorative "Tick" for selected cards */}
      {selected && (
        <div className="absolute bottom-[-20px] right-[-20px] opacity-5 text-[10rem] font-black pointer-events-none">
          ✓
        </div>
      )}
    </div>
  )
}