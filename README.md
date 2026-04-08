# CampusConnect

CampusConnect is a student networking platform for IIIT Agartala that supports announcements, networking, discussion, donations, profiles, and real-time messaging.

## Repository Structure

- `client/` - React + Vite frontend
- `server/` - Node.js + Express backend

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MongoDB

## Environment Setup

1. Backend env:
   - Copy `server/.env.example` to `server/.env`
   - Fill all required values (Google OAuth, MongoDB, Cloudinary, session secret)
2. Frontend env:
   - Copy `client/.env.example` to `client/.env`
   - Update `VITE_backend_URL` if your backend is not `http://localhost:3000`

## Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

## Run Locally

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## Optional Scripts

- Backend seed:
  ```bash
  cd server
  npm run seed
  ```
- Notification backfill (30 days):
  ```bash
  cd server
  npm run backfill:notifications
  ```

## GitHub Push Checklist

1. Verify ignored files are not staged (`.env`, `node_modules`, build outputs)
2. Stage files:
   ```bash
   git add .
   ```
3. Create first commit:
   ```bash
   git commit -m "Initial project setup"
   ```
4. Add remote and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

## Tech Stack

- Frontend: React, Vite, TailwindCSS, Material UI
- Backend: Node.js, Express, Passport
- Database: MongoDB
- Realtime: Socket.IO
- Media: Cloudinary
