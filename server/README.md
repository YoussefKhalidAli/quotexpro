# Finca Server

Simple Express + Mongoose API for Finca frontend.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` to your MongoDB connection string.

2. Install dependencies and run in dev mode:

```powershell
cd server; npm install
npm run dev
```

From project root you can run the server dev script with:

```powershell
npm run server
```

API endpoints are available under `http://localhost:4000/api` by default.

Only the `MONGO_URI` needs to be set in the `.env` file as requested.
