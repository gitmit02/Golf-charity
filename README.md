# Golf Charity Platform

A full-stack golf performance and charity subscription platform where players can:
- subscribe monthly/yearly,
- log their last 5 golf scores,
- enter monthly prize draws,
- and direct part of their subscription to a charity.

## Tech Stack

- Frontend: React 18, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth
- Media Uploads: Cloudinary (for proof/charity images)

## Project Structure

```text
Golf_charity/
├── client/   # React + Vite frontend
└── server/   # Express + MongoDB backend
```

## Features

- User registration and login (JWT-based auth)
- Password reset flow (`/forgot-password`)
- Subscription plans (monthly/yearly)
- Charity selection and impact dashboard
- Score submission (range 1-45, keeps last 5)
- Monthly draw system with winner tiers:
  - 5 match: Rs 10,000
  - 4 match: Rs 2,500
  - 3 match: Rs 500
- Admin dashboard:
  - View users
  - View winners
  - View analytics
  - Create charities
  - Run monthly draw

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas URI
- Cloudinary account

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

Optional frontend env (`client/.env`):

```env
# Optional. Leave empty for local dev with Vite proxy.
VITE_API_BASE_URL=
```

## Local Setup

### 1. Clone

```bash
git clone <your-repo-url>
cd Golf_charity
```

### 2. Install dependencies

```bash
cd server
npm install
cd ../client
npm install
```

### 3. Run backend

```bash
cd server
npm start
```

Backend runs on `http://localhost:5000`.

### 4. Run frontend (new terminal)

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Overview

Base URL (local): `http://localhost:5000`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/reset-password`
- `GET /api/auth/profile` (auth required)

### User
- `GET /api/user/dashboard` (auth required)
- `POST /api/user/subscription` (auth required)
- `POST /api/user/upload-proof` (auth required, multipart file field: `proofImage`)
- `POST /api/user/charity` (auth required)
- `GET /api/user/public-stats`

Admin only:
- `GET /api/user/admin/users`
- `GET /api/user/admin/winners`
- `GET /api/user/admin/analytics`

### Scores
- `POST /api/scores/add` (auth required)
- `GET /api/scores` (auth required)

### Draw
- `POST /api/draw/run` (admin required)
- `GET /api/draw/latest`
- `GET /api/draw/meta`

### Charities
- `GET /api/charities`
- `POST /api/charities` (admin required)

## Notes

- In local development, `client/vite.config.js` proxies `/api` to `http://localhost:5000`.
- No automated tests are currently configured in this repository.

## Deployment Tips

- Set all `server/.env` variables in your hosting environment.
- Deploy backend first, then set `VITE_API_BASE_URL` in frontend for production.
- Ensure CORS is configured for your frontend domain.

## License

This project is currently unlicensed. Add a `LICENSE` file (for example MIT) before open-source distribution.

