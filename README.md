# TaskFlow — Full-Stack Task Manager

A production-ready Task Manager application built with Node.js, Express, MongoDB, React, and Vite.

## Features

- **JWT Authentication** (register / login / protected routes)
- **Role-based access control** (user / admin)
- **Full Task CRUD** with status, priority, due dates
- **React frontend** with protected routes and real-time toast notifications
- **Security**: Helmet, CORS, rate limiting, mongo-sanitize
- **Input validation** with express-validator
- **Swagger API docs** at `/api-docs`
- **Clean scalable folder structure**

---

## Prerequisites

- Node.js ≥ 18
- MongoDB (local or MongoDB Atlas)

---

## Project Structure

```
taskmanager/
├── backend/
│   ├── config/          # Swagger config
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth, error, validation
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routers
│   ├── utils/           # JWT helpers, AppError
│   ├── validators/      # express-validator rules
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance + API calls
    │   ├── components/  # TaskCard, TaskModal, ProtectedRoute
    │   ├── context/     # AuthContext, ToastContext
    │   ├── pages/       # Login, Register, Dashboard
    │   └── App.jsx
    ├── .env.example
    ├── index.html
    └── vite.config.js
```

---

## Setup & Run

### 1. Clone and install backend

```bash
cd taskmanager/backend
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

Backend starts at **http://localhost:5000**  
API docs at **http://localhost:5000/api-docs**

### 2. Install and run frontend

```bash
cd taskmanager/frontend

npm install
npm run dev
```

Frontend starts at **http://localhost:5173**

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/taskmanager` |
| `JWT_SECRET` | JWT signing secret | *(set a strong value)* |
| `JWT_EXPIRE` | Token expiry | `7d` |
| `NODE_ENV` | Environment | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## API Endpoints

### Auth (`/api/v1/auth`)

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login user |
| GET | `/me` | Yes | Get current user |

### Tasks (`/api/v1/tasks`)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Get all tasks (with filters) |
| POST | `/` | Yes | Create task |
| GET | `/:id` | Yes | Get single task |
| PUT | `/:id` | Yes | Update task |
| DELETE | `/:id` | Yes | Delete task |

### Users (`/api/v1/users`) — Admin only

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Admin | Get all users |
| DELETE | `/:id` | Admin | Delete user + their tasks |

---

## Making an Admin

Register a user normally, then update their role in MongoDB:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## Tech Stack

**Backend:** Node.js · Express · MongoDB · Mongoose · JWT · bcryptjs · Helmet · express-validator · Swagger  
**Frontend:** React 18 · Vite · React Router v6 · Axios · CSS Modules
