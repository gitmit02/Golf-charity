// TODO: Replace static data with backend API - GET /api/users
// TODO: Connect to Node.js backend with JWT authentication
export const users = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'user@test.com',
    password: '123456', // TODO: Remove - never store plain passwords. Use bcrypt + backend
    subscription: 'monthly',
    subscriptionActive: true,
    charityId: 1,
    totalWinnings: 350,
    prizeTier: 'Silver',
    joinDate: '2025-09-01',
    scores: [32, 28, 35, 30, 25],
  },
  {
    id: 2,
    name: 'Sarah Williams',
    email: 'sarah@test.com',
    password: 'test123',
    subscription: 'yearly',
    subscriptionActive: true,
    charityId: 2,
    totalWinnings: 870,
    prizeTier: 'Gold',
    joinDate: '2025-07-15',
    scores: [22, 19, 24, 27, 21],
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike@test.com',
    password: 'mike123',
    subscription: null,
    subscriptionActive: false,
    charityId: 3,
    totalWinnings: 0,
    prizeTier: 'None',
    joinDate: '2025-11-20',
    scores: [40, 38, 42, 36, 39],
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma@test.com',
    password: 'emma123',
    subscription: 'monthly',
    subscriptionActive: true,
    charityId: 1,
    totalWinnings: 125,
    prizeTier: 'Bronze',
    joinDate: '2025-12-05',
    scores: [29, 31, 27, 33, 28],
  },
]

// Static logged-in user (simulating a session)
// TODO: Replace with real session/auth context from backend JWT token
export const currentUser = users[0]
