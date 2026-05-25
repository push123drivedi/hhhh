# Render Deployment Guide

Use these files for Render deployment:

```text
render.yaml
backend/.env.render.example
frontend/.env.render.example
```

## Option A: Render Blueprint

1. Push this project to GitHub.
2. Open Render Dashboard.
3. Click **New +**.
4. Select **Blueprint**.
5. Connect the GitHub repo.
6. Render will read `render.yaml`.
7. Add the required secret value for `MONGO_URI`.
8. Deploy.

## Option B: Manual Deploy

### Backend Web Service

Create a new **Web Service**.

Settings:

```text
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

Environment variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/svms_staff_duty?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-url.onrender.com
```

After backend deploys, open:

```text
https://your-backend-url.onrender.com/api/health
```

### Frontend Static Site

Create a new **Static Site**.

Settings:

```text
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Environment variables:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

Add rewrite rule:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

## MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow network access from anywhere for Render:

```text
0.0.0.0/0
```

4. Copy the connection string into `MONGO_URI`.

## Seed Production Database

After backend is deployed, seed once from your local machine:

```bash
cd backend
$env:MONGO_URI="mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/svms_staff_duty?retryWrites=true&w=majority"
$env:JWT_SECRET="same_or_any_long_secret_for_seed_runtime"
npm.cmd run seed
```

Admin login:

```text
admin@svms.edu
Admin@123
```

Change demo passwords after first login.
