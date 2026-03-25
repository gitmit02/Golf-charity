// TODO: Replace static data with backend API - GET /api/scores/:userId
// TODO: Fetch user scores from database (MongoDB or PostgreSQL)
export const initialScores = [
  { id: 1, score: 32, date: '2026-03-01', userId: 1 },
  { id: 2, score: 28, date: '2026-03-05', userId: 1 },
  { id: 3, score: 35, date: '2026-03-10', userId: 1 },
  { id: 4, score: 30, date: '2026-03-15', userId: 1 },
  { id: 5, score: 25, date: '2026-03-20', userId: 1 },
]

// Helper: keep only last 5 scores
// TODO: This logic should live server-side in the backend
export const keepLastFive = (scores) => scores.slice(-5)
