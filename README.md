# VideoStream

A minimal video-sharing web app (frontend + backend). The Frontend is a Vite + React app and the Backend is an Express.js API with MongoDB and Cloudinary for media.
---
Live Demo: [click here](https://videostream-10.vercel.app/)
---

Quick overview
- Frontend: located in `Frontend` — React, Vite, Tailwind.
- Backend: located in `Backend` — Node.js (ESM), Express, Mongoose, JWT auth, Cloudinary for uploads.

Quick start

1) Backend

```bash
cd Backend
cp .env.sample .env    # set env vars (MONGODB_URI, DB_NAME, Cloudinary, JWT secrets)
npm install
npm run dev
```

Default backend port: `PORT` from `.env` (defaults to 3000).

2) Frontend

```bash
cd Frontend
npm install
npm run dev
```

What you'll find
- API routes: `Backend/src/routes/*` (base path `/api/v1`)
- Backend docs: see [Backend/README.md](Backend/README.md)
- Frontend source: `Frontend/src`

Contributing
- Open an issue or PR. For local development, run both services and point the frontend `apiClient` to the backend URL.

Contact
- Author: Omkar Patil (see `package.json` in `Backend`)
