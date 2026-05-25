# St. Vivekanand Millennium School - AI Smart Staff Duty Management System

Production-ready MERN-style duty management system for **St. Vivekanand Millennium School**. The system is built as an **AI recommendation + manual verification** workflow: AI recommends which Group D worker should clean a room, then admin manually marks the room **DONE** or **NOT DONE**.

## Folder Structure

```text
build-a-full-stack-ai-based/
├── backend/
│   ├── src/
│   │   ├── config/              # MongoDB connection, SVMS floor/section/room structure
│   │   ├── controllers/         # Auth, dashboard, floors, rooms, staff, tasks, reports
│   │   ├── middleware/          # JWT auth and role guards
│   │   ├── models/              # Users, Staff, Floors, Sections, Rooms, Tasks, Reports, Notifications
│   │   ├── routes/              # REST API routes
│   │   ├── seed/                # SVMS sample data seeding
│   │   ├── services/            # AI recommendation, dashboard stats, sockets, scheduler
│   │   ├── sockets/             # Socket.io setup
│   │   ├── utils/               # Token and async helpers
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── svms-logo.png        # School logo used as watermark
│   ├── src/
│   │   ├── components/          # Layout, stat cards, room cards, task list, status badges
│   │   ├── context/             # Auth and dark/light theme
│   │   ├── pages/               # Login, dashboard, floors, sections, rooms, workers, reports, analytics, alerts
│   │   ├── services/            # Axios and Socket.io clients
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Features

- SVMS orange, white, and dark-blue premium enterprise UI.
- Uploaded school logo used as a subtle watermark on login, dashboard, cards, and reports.
- JWT login authentication with Admin, Supervisor, and Staff roles.
- MongoDB schemas for Users, Staff, Floors, Sections, Rooms, Cleaning Tasks, Daily Reports, and Notifications.
- AI recommends nearest available worker while balancing workload and prioritizing washrooms, admin rooms, labs, utilities, and large rooms.
- Manual admin verification with **DONE** and **NOT DONE** controls.
- No automatic completion.
- Real-time updates using Socket.io.
- Dashboard charts with Recharts.
- Floor management, section cards, room status, worker management, reports, analytics, and notifications.
- Dark/light mode and responsive layout.

## Environment Variables

Backend: create `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/svms_staff_duty
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Frontend: create `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Setup Commands

Install backend:

```bash
cd backend
npm.cmd install
```

Install frontend:

```bash
cd ../frontend
npm.cmd install
```

## MongoDB Setup

Use local MongoDB:

```text
mongodb://127.0.0.1:27017/svms_staff_duty
```

Or use MongoDB Atlas and replace `MONGO_URI` in `backend/.env`.

Seed sample SVMS data:

```bash
cd backend
npm.cmd run seed
```

Seed includes:

- Ground Floor sections A-G
- First Floor sections H-K
- All requested rooms
- Group D workers A, B, C, D, E
- Admin and supervisor users
- Initial notification

## Admin Login Credentials

```text
Admin: admin@svms.edu / Admin@123
Supervisor: supervisor@svms.edu / Admin@123
Staff sample: a@svms.edu / Admin@123
```

## Run Commands

Backend:

```bash
cd backend
npm.cmd run dev
```

Frontend:

```bash
cd frontend
npm.cmd run dev
```

Open:

```text
http://localhost:5173
```

## API Summary

```text
POST   /api/auth/login
GET    /api/auth/me
GET    /api/dashboard
GET    /api/floors
GET    /api/floors/sections/all
GET    /api/rooms
GET    /api/rooms/:id
PATCH  /api/rooms/:id
GET    /api/staff
POST   /api/staff
PATCH  /api/staff/:id
GET    /api/staff/attendance
PATCH  /api/staff/:staffId/attendance
GET    /api/tasks
POST   /api/tasks/recommend
PATCH  /api/tasks/:id/assign
PATCH  /api/tasks/:id/start
PATCH  /api/tasks/:id/verify
GET    /api/reports
POST   /api/reports/generate
GET    /api/notifications
```

## AI Recommendation Logic

The AI service scores workers using:

- Distance from worker to room coordinates.
- Same-floor preference.
- Worker skills for room type.
- Current workload score.
- Historical assigned task count.
- Room priority.

Priority order:

```text
Washrooms > Admin Rooms > Labs > Utilities/Large Rooms > Classrooms/Support Rooms
```

Room stages:

```text
Sweeping
Mopping
Dusting
```

Cleaning time rules:

```text
Small classrooms: 20-25 minutes
Labs / large rooms: 30 minutes
Washrooms: 15-20 minutes
```

## Deployment Steps

Backend:

1. Deploy `backend` to Render, Railway, Fly.io, or a VPS.
2. Set production `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT`.
3. Use MongoDB Atlas for production.
4. Run `npm.cmd run seed` once for initial SVMS data.
5. Start with `npm.cmd start`.

Frontend:

1. Deploy `frontend` to Vercel, Netlify, or static hosting.
2. Set `VITE_API_URL=https://your-backend-domain.com/api`.
3. Set `VITE_SOCKET_URL=https://your-backend-domain.com`.
4. Build with `npm.cmd run build`.

Netlify frontend deploy:

1. Keep `netlify.toml` at the project root.
2. In Netlify, set build command to `npm run build`.
3. Set publish directory to `frontend/dist`.
4. Set base directory to `frontend`.
5. Add environment variables:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

Note: this project uses Express + Socket.io for the backend, so deploy the backend separately on Render, Railway, Fly.io, or a VPS. Netlify static hosting alone cannot run the real-time Express server.

Production checklist:

- Replace demo passwords.
- Use a strong JWT secret.
- Enable HTTPS.
- Configure MongoDB backups.
- Restrict CORS to your real frontend domain.
- Add user management policies before public use.

## Render Deployment Files

Render-ready files are included:

```text
render.yaml
RENDER_DEPLOYMENT.md
backend/.env.render.example
frontend/.env.render.example
```

Read [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for exact Render setup.
