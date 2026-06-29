# 5Min ⚡

**On-demand micro-teaching platform.** Post a question, get a live 5-minute explanation from someone who knows.
---

## What it does

- Post a question with topic, description, and tags
- Anyone can volunteer to explain it live
- A 5-minute real-time chat session opens between both users
- Timer runs server-side — no manipulation
- Learner rates the session at the end

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), Socket.io-client |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Real-time | Socket.io |
| Auth | JWT + bcrypt |
| Deployment | Vercel (frontend), Render (backend) |

---

## Features

- JWT-based auth (register / login)
- Post, browse, and accept teach requests
- Real-time chat via Socket.io
- Server-side 5-minute countdown timer
- Outcome tracking (got it / didn't get it)
- Teacher rating system
- Persistent chat history in MongoDB

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

### Clone

```bash
git clone https://github.com/yourusername/5min.git
cd 5min
```

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/5min
JWT_SECRET=your_random_secret
PORT=5000
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Project Structure

```
5min/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/               # User, Request, Session, Rating
│   ├── routes/               # auth, requests, sessions, ratings
│   ├── middleware/auth.js    # JWT verify middleware
│   ├── socket/handlers.js    # Socket.io events + timer logic
│   └── server.js             # Entry point
│
└── frontend/
    └── src/
        ├── pages/            # Login, Register, Feed, Session
        ├── components/       # Navbar, RequestCard, ChatBox, Timer, OutcomeModal
        └── context/          # AuthContext, SocketContext
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |

### Requests
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/requests` | Get all open requests |
| POST | `/api/requests` | Create a request |
| POST | `/api/requests/:id/accept` | Accept and start session |
| DELETE | `/api/requests/:id` | Delete own request |

### Sessions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sessions/:id` | Get session details |
| POST | `/api/sessions/:id/outcome` | Submit outcome |

### Ratings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ratings` | Rate a teacher |

---

## Socket Events

| Event | Direction | Description |
|---|---|---|
| `join-session` | client → server | Join a session room |
| `peer-joined` | server → client | Other user joined |
| `tick` | server → client | Timer countdown (every 1s) |
| `timer-end` | server → client | 5 minutes up |
| `send-message` | client → server | Send a chat message |
| `receive-message` | server → client | Broadcast message to room |
| `end-session` | client → server | Manually end session |

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | `https://5min.vercel.app` |
| Backend | Render | `https://5min-api.onrender.com` |

---

## License

MIT