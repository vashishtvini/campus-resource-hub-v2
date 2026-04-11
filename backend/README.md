# 🏫 Campus Resource Hub v2 — Backend

A RESTful API server for the Campus Resource Hub platform, built with **Node.js**, **Express**, and **MongoDB**. Handles Google OAuth authentication (via Passport.js), JWT session management, and file upload/download for academic resources.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | Passport.js · Google OAuth 2.0 · JWT |
| File Uploads | Multer (local disk storage) |
| Validation | Zod |
| Session | express-session (short-lived, OAuth only) |
| Dev Tools | nodemon |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js           # Entry point — starts HTTP server
│   ├── app.js              # Express app setup (middleware, routes)
│   ├── db.js               # MongoDB connection
│   ├── passport.js         # Google OAuth strategy config
│   ├── controllers/
│   │   ├── authController.js     # OAuth callback, /me, logout
│   │   └── resourceController.js # Upload, list, search, vote, download
│   ├── middleware/
│   │   └── requireAuth.js        # JWT authentication guard
│   ├── models/
│   │   ├── User.js               # User schema (Google profile)
│   │   └── Resource.js           # Resource schema (files + metadata)
│   └── routes/
│       ├── authRoutes.js         # /api/auth/*
│       └── resourceRoutes.js     # /api/resources/*
└── uploads/                # Local file storage (auto-created)
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/campus-resource-hub-v2` |
| `JWT_SECRET` | Secret key for signing JWTs | *(required)* |
| `SESSION_SECRET` | Secret for express-session | *(required)* |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | *(required — from Google Cloud Console)* |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | *(required)* |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URI | `http://localhost:4001/api/auth/google/callback` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `PORT` | Port to listen on | `4001` |
| `UPLOAD_DIR` | Directory for uploaded files | `uploads` |

> **Tip:** Get Google OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com). Add `GOOGLE_CALLBACK_URL` to your OAuth app's **Authorized redirect URIs**.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally or a MongoDB Atlas URI

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 3. Start the development server (with auto-reload)
npm run dev

# OR start in production mode
npm start
```

The server will be available at **http://localhost:4001**.

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/auth/google` | Public | Initiates Google OAuth flow |
| `GET` | `/api/auth/google/callback` | Public | OAuth callback — issues JWT, redirects to frontend |
| `GET` | `/api/auth/me` | 🔒 JWT | Returns the current logged-in user |
| `POST` | `/api/auth/logout` | Public | Clears session (client should delete token) |

### Resources — `/api/resources`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/resources` | Public | List all resources (paginated) |
| `GET` | `/api/resources/search` | Public | Search resources by title/subject |
| `GET` | `/api/resources/:id` | Public | Get a single resource by ID |
| `GET` | `/api/resources/:id/download` | Public | Download the resource file |
| `GET` | `/api/resources/:id/view` | Public | View/stream the resource file |
| `POST` | `/api/resources` | 🔒 JWT | Upload a new resource (multipart/form-data) |
| `POST` | `/api/resources/:id/vote` | 🔒 JWT | Upvote or downvote a resource |

#### Upload Resource — Request Body (`multipart/form-data`)

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | The resource file (max 25 MB) |
| `title` | string | ✅ | Resource title (max 200 chars) |
| `subject` | string | ✅ | Subject name (max 80 chars) |
| `semester` | number | ✅ | Semester number (1–12) |
| `type` | string | ✅ | One of: `notes`, `PYQ`, `assignment` |

---

## 🗃️ Data Models

### User
```js
{
  googleId: String,       // Unique Google account ID
  name: String,
  email: String,
  avatar: String          // Profile picture URL
}
```

### Resource
```js
{
  title: String,          // max 200 chars
  subject: String,        // max 80 chars
  semester: Number,       // 1–12
  type: String,           // "notes" | "PYQ" | "assignment"
  filePath: String,       // Server-side file path
  originalName: String,   // Original filename
  mimeType: String,
  size: Number,           // Bytes
  uploader: ObjectId,     // Ref → User
  upvotes: Number,
  downvotes: Number,
  voteByUser: Map         // userId → "up" | "down"
}
```

---

## 🔐 Authentication Flow

```
Browser → GET /api/auth/google
       → Google OAuth consent screen
       → GET /api/auth/google/callback
       → Server issues JWT
       → Redirects to frontend with ?token=<jwt>
       → Frontend stores token in localStorage
       → All protected requests send Authorization: Bearer <jwt>
```

---

## 📝 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-reload on changes) |
| `npm start` | Start in production mode |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

ISC
