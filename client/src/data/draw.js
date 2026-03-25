// TODO: Replace static data with backend API - GET /api/draw/latest
// TODO: Draw logic should run on the backend (Node.js cron job monthly)
export const latestDraw = {
  month: 'March 2026',
  numbers: [12, 24, 30, 35, 41],
  date: '2026-03-31',
}

export const pastDraws = [
  { month: 'February 2026', numbers: [7, 15, 22, 38, 44], date: '2026-02-28' },
  { month: 'January 2026',  numbers: [3, 19, 27, 31, 40], date: '2026-01-31' },
]

// Prize tier configuration
export const prizeTiers = {
  5: { label: 'Jackpot',   prize: 5000,  color: 'text-yellow-600',  bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  4: { label: 'Gold',      prize: 1000,  color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200'  },
  3: { label: 'Silver',    prize: 350,   color: 'text-gray-500',    bg: 'bg-gray-50',    border: 'border-gray-200'   },
  2: { label: 'Bronze',    prize: 125,   color: 'text-orange-500',  bg: 'bg-orange-50',  border: 'border-orange-200' },
  1: { label: 'Entry',     prize: 25,    color: 'text-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-200'   },
}

// Simulate draw: generate 5 random numbers 1-45
// TODO: Replace with backend draw endpoint - POST /api/draw/run (admin only)
export const simulateDraw = () => {
  const nums = new Set()
  while (nums.size < 5) nums.add(Math.floor(Math.random() * 45) + 1)
  return [...nums].sort((a, b) => a - b)
}

// Check how many of a user's scores match the draw numbers
// TODO: Move this comparison logic to the backend
export const checkMatches = (userScores, drawNumbers) => {
  return userScores.filter(s => drawNumbers.includes(s)).length
}
