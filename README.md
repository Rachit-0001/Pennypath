# 💰 PennyPath — Expense Tracker

A complete, production-ready **MERN stack** expense tracking application. Track expenses and
income, set monthly budgets, manage custom categories, and visualize your financial habits with
interactive charts — all secured with JWT authentication.

---

## ✨ Features

- 🔐 **Authentication** — Register/Login with JWT, bcrypt password hashing, protected routes
- 📊 **Dashboard** — Monthly overview: total income, expense, balance, budget progress, recent transactions
- 💸 **Expense Management** — Full CRUD, search, filter by category, pagination
- 💵 **Income Management** — Full CRUD, search, filter by category, pagination
- 🎯 **Monthly Budgets** — Set overall + per-category limits with visual progress bars
- 🏷️ **Custom Categories** — Add/remove categories for both expenses and income
- 📈 **Reports & Charts** — Income vs expense trend (bar chart), category breakdown (pie chart) via Recharts
- 👤 **Profile Management** — Update name/currency, change password
- 📱 **Responsive UI** — Mobile-first design built with Tailwind CSS
- ⚠️ **Error Handling** — Centralized backend error handler + friendly frontend toasts
- ⏳ **Loading States** — Skeleton/spinner loaders across all async views
- 🔔 **Toast Notifications** — Success/error feedback via `react-hot-toast`

---

## 🛠️ Tech Stack

| Layer          | Technology                                              |
|----------------|----------------------------------------------------------|
| Frontend       | React (Vite), Tailwind CSS, React Router, Axios, Recharts |
| Backend        | Node.js, Express.js                                      |
| Database       | MongoDB Atlas + Mongoose                                 |
| Auth           | JWT + bcryptjs                                            |
| Notifications  | react-hot-toast                                           |

---

## 📁 Folder Structure

```
PennyPath-Expense-Tracker/
│
├── client/                        # React (Vite) frontend
│   ├── src/
│   │   ├── assets/                # Static assets
│   │   ├── components/            # Reusable UI components
│   │   ├── context/                # AuthContext (global auth state)
│   │   ├── hooks/                  # useAuth, useDebounce, useCurrency
│   │   ├── pages/                  # Route-level pages
│   │   ├── services/                # Axios API service modules
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   └── vite.config.js
│
├── server/                        # Express backend
│   ├── config/                     # DB connection, constants
│   ├── controllers/                 # Route handler logic (MVC "Controller")
│   ├── middleware/                  # Auth, error handling, validation
│   ├── models/                      # Mongoose schemas (MVC "Model")
│   ├── routes/                      # Express routers
│   ├── utils/                       # JWT, response, date helpers
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (see [MongoDB Atlas Setup](#-mongodb-atlas-setup))
- Git

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/PennyPath-Expense-Tracker.git
cd PennyPath-Expense-Tracker
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env and fill in your MongoDB URI, JWT secret, and client URL
npm run dev          # starts on http://localhost:5000 (nodemon)
```

### 3. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:5000/api
npm run dev          # starts on http://localhost:5173
```

Visit `http://localhost:5173` in your browser. 🎉

---

## 🔑 Environment Variables

### Server (`server/.env`)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/pennypath?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173,https://your-app.vercel.app
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

Base URL: `/api`

### Auth (`/api/auth`)
| Method | Endpoint         | Description               | Access  |
|--------|------------------|----------------------------|---------|
| POST   | `/register`      | Register new user          | Public  |
| POST   | `/login`         | Login and receive JWT      | Public  |
| GET    | `/me`            | Get current user profile   | Private |

### Users (`/api/users`)
| Method | Endpoint                          | Description                     | Access  |
|--------|------------------------------------|----------------------------------|---------|
| PUT    | `/profile`                        | Update name/currency/avatar      | Private |
| PUT    | `/password`                       | Change password                  | Private |
| POST   | `/categories`                     | Add a custom category            | Private |
| DELETE | `/categories/:type/:name`         | Delete a category                | Private |
| PUT    | `/budget`                         | Set default monthly budget       | Private |

### Expenses (`/api/expenses`)
| Method | Endpoint | Description                                    | Access  |
|--------|----------|--------------------------------------------------|---------|
| GET    | `/`      | List expenses (search, category, pagination)     | Private |
| POST   | `/`      | Create a new expense                             | Private |
| GET    | `/:id`   | Get a single expense                             | Private |
| PUT    | `/:id`   | Update an expense                                | Private |
| DELETE | `/:id`   | Delete an expense                                | Private |

### Income (`/api/income`)
| Method | Endpoint | Description                                    | Access  |
|--------|----------|--------------------------------------------------|---------|
| GET    | `/`      | List income entries (search, category, pagination) | Private |
| POST   | `/`      | Create a new income entry                        | Private |
| GET    | `/:id`   | Get a single income entry                        | Private |
| PUT    | `/:id`   | Update an income entry                           | Private |
| DELETE | `/:id`   | Delete an income entry                           | Private |

### Budget (`/api/budget`)
| Method | Endpoint    | Description                          | Access  |
|--------|-------------|----------------------------------------|---------|
| GET    | `/`         | Get budget for month/year (query)      | Private |
| POST   | `/`         | Create/update budget (upsert)          | Private |
| GET    | `/history`  | Get all past budgets                   | Private |
| DELETE | `/:id`      | Delete a budget                        | Private |

### Reports (`/api/reports`)
| Method | Endpoint               | Description                                  | Access  |
|--------|-------------------------|-----------------------------------------------|---------|
| GET    | `/dashboard`            | Monthly summary + recent transactions          | Private |
| GET    | `/trend`                | 12-month income vs expense trend               | Private |
| GET    | `/category-breakdown`   | Category-wise totals (expense or income)       | Private |

All `Private` routes require an `Authorization: Bearer <token>` header.

---

## 🗄️ MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a new **Cluster** (the free M0 tier is enough).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) so Render can connect.
5. Click **Connect → Drivers**, copy the connection string, and replace `<username>`, `<password>`,
   and add a database name (e.g. `pennypath`) before the `?` query params.
6. Paste this into `MONGO_URI` in your `server/.env`.

---

## ☁️ Deployment Guide

### Backend Deployment on Render

1. Push your code to GitHub (see [GitHub Deployment](#-github-deployment) below).
2. Go to [render.com](https://render.com) → **New → Web Service** → connect your GitHub repo.
3. Configure the service:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Add environment variables under **Environment**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=<your MongoDB Atlas URI>
   JWT_SECRET=<your secret>
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://your-app.vercel.app
   ```
5. Deploy. Render will give you a URL like `https://pennypath-api.onrender.com`.
6. Verify it's running: visit `https://pennypath-api.onrender.com/api/health`.

### Frontend Deployment on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo.
2. Configure the project:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add an environment variable:
   ```
   VITE_API_URL=https://pennypath-api.onrender.com/api
   ```
4. Deploy. Vercel will give you a URL like `https://pennypath.vercel.app`.
5. Go back to your Render backend's `CLIENT_URL` env var and add this Vercel URL (comma-separated
   if keeping localhost too), then redeploy the backend so CORS accepts requests from it.

### Result
```
React (Vercel)  ⇄  Express API (Render)  ⇄  MongoDB Atlas
```

---

## 🐙 GitHub Deployment (Git Setup)

```bash
# Initialize git in the project root
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: PennyPath Expense Tracker"

# Set the main branch
git branch -M main

# Add your GitHub remote (create an empty repo on GitHub first)
git remote add origin https://github.com/<your-username>/PennyPath-Expense-Tracker.git

# Push to GitHub
git push -u origin main
```

For future changes:
```bash
git add .
git commit -m "Describe your change"
git push
```

---

## 🖼️ Screenshots

> Add screenshots of your running application here after deployment.

| Dashboard | Expenses | Reports |
|-----------|----------|---------|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## 🧩 Architecture Notes

- **MVC pattern** on the backend: `models/` (Mongoose schemas) → `controllers/` (business logic) →
  `routes/` (Express routers wire endpoints to controllers).
- **Service layer** on the frontend: all HTTP calls live in `src/services/`, keeping components
  free of Axios boilerplate.
- **Global auth state** via React Context (`AuthContext`) + a custom `useAuth` hook.
- **Reusable UI primitives**: `Modal`, `ConfirmDialog`, `Loader`, `StatCard`, `TransactionTable`,
  `Pagination` used across multiple pages.
- **Security**: helmet, rate limiting on auth routes, CORS allow-list, JWT expiry, bcrypt hashing,
  express-validator input validation on every mutating route.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
