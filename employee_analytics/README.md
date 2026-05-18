# AI-Based Employee Performance Analytics System

A full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations using the DeepSeek model via OpenRouter API.

## Features
- **Authentication**: Secure JWT-based login and registration.
- **Employee Management**: Add, view, search, and delete employees.
- **Dashboard**: Visual insights using charts to track overall performance and department distributions.
- **AI Recommendations**: Get actionable insights on promotions, training, and improvement feedback.
- **Premium UI**: Modern dark theme with glassmorphism, responsive design, and smooth animations.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, Recharts, Lucide React, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, Axios.
- **AI**: DeepSeek Chat model via OpenRouter.

## Setup Instructions

### Backend
1. Open a terminal and navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Ensure the `.env` file exists with the following variables:
   - `PORT=5000`
   - `MONGO_URI=mongodb+srv://admin:admin@cluster0.67qy8ud.mongodb.net/employee_analytics?retryWrites=true&w=majority`
   - `JWT_SECRET=swayam1703`
   - `OPENROUTER_API_KEY=your_openrouter_api_key_here`
4. Start the server: `npm run dev`

### Frontend
1. Open a new terminal and navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

## Deployment Instructions (Render)

### 1. Backend Deployment (Web Service)
1. Push your repository to GitHub.
2. Go to [Render](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the Root Directory to `backend` (if you structured it as a monorepo) or leave empty if the backend is the root.
5. Set Build Command: `npm install`
6. Set Start Command: `npm start`
7. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`).
8. Deploy. Note the provided Render URL (e.g., `https://your-backend.onrender.com`).

### 2. Frontend Deployment (Static Site)
1. In the `frontend` code, update the `baseURL` in `src/utils/api.js` to your deployed backend URL.
2. Go to Render and create a new **Static Site**.
3. Connect your GitHub repository.
4. Set Root Directory to `frontend`.
5. Set Build Command: `npm run build`
6. Set Publish Directory: `dist`
7. Deploy. Your application will be live on the provided Render URL.
