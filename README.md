# AI-Powered Research Assistant Dashboard

An advanced Full-Stack MERN (MongoDB, Express, React, Node.js) application designed for AI-driven research workflows. Features a sleek, responsive UI built with Tailwind CSS, a custom authentication system, and mock AI insight generation.

## 🚀 Features
- **Modern Tech Stack**: React (Vite), Node.js, Express, MongoDB.
- **Robust Authentication**: Secure JWT-based authentication with Zod validation.
- **Complex UI**: Interactive Kanban board and paginated data tables.
- **Premium Aesthetics**: Fully responsive UI with Tailwind CSS, including a native dark mode and glassmorphism elements.
- **Deploy Ready**: Fully configured for Vercel Serverless deployments and Docker containerization.

## 🛠 Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally or MongoDB Atlas URI)

## ⚙️ Local Development

### 1. Installation
Install dependencies for both the frontend and the backend from the root directory:
```bash
npm run install-all
```

### 2. Environment Variables
Navigate to the `server/` directory and rename `.env.example` to `.env`. Ensure your MongoDB is running or update the `MONGO_URI`.

### 3. Run the App
Start both the React frontend and Express backend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📦 Deployment
This repository is configured for both Docker and Vercel.
- **Vercel**: Automatically detected via `vercel.json`. The backend will run as serverless functions.
- **Docker**: Build the image using the provided `Dockerfile` which utilizes a multi-stage build.

## 📄 Engineering Tradeoffs
See [TRADEOFFS.md](./TRADEOFFS.md) for detailed explanations regarding state management choices, database schema design, and API rate limiting strategies.
