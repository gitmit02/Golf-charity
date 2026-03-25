import { useState } from 'react'

export default function ScoreForm({ onAddScore, onCancel }) {
  const [score, setScore] = useState('')
  const [date, setDate]   = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  const validate = () => {
    const s = Number(score)
    if (!score) return 'Score is required'
    if (isNaN(s) || s < 1 || s > 45) return 'Score must be between 1 and 45'
    if (!date) return 'Date is required'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    onAddScore({ score: Number(score), date })
    setScore('')
    setDate(new Date().toISOString().split('T')[0])
    setError('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-emerald-100 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-emerald-900/5 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⛳</span>
          <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Add New Round</h4>
        </div>
        <span className="hidden sm:block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">
          Verification Required
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 animate-shake">
          <span>⚠️</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Score (1–45)</label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="45"
              value={score}
              onChange={e => setScore(e.target.value)}
              placeholder="e.g. 28"
              className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 font-bold transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none placeholder:text-slate-300"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">Strokes</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Round</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 font-bold transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button 
          type="submit" 
          className="bg-slate-900 text-white font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest transition-all hover:bg-black active:scale-[0.98] shadow-lg shadow-slate-200 flex-1"
        >
          Confirm & Save Score
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-white border-2 border-slate-100 text-slate-500 font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 px-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          Only your <span className="text-slate-900">last 5 scores</span> are active for the £5,000 monthly draw.
        </p>
      </div>
    </form>
  )
}