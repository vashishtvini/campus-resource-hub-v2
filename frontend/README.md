# 🏫 Campus Resource Hub v2 — Frontend

The client-side application for the Campus Resource Hub platform, built with **React 18** and **Vite**. Enables students to browse, search, upload, and vote on academic resources with Google OAuth authentication.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router DOM v6 |
| Icons | Lucide React |
| Styling | Vanilla CSS (custom design system) |
| Auth | JWT (stored in localStorage) |

---

## 📁 Project Structure

```
frontend/
├── index.html                  # HTML shell
├── vite.config.js              # Vite configuration
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with routes
│   ├── index.css               # Global styles & design system
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── ProtectedRoute.jsx  # Auth guard wrapper
│   │   └── ResourceCard.jsx    # Resource display card
│   ├── pages/
│   │   ├── LandingPage.jsx     # Home / sign-in page
│   │   ├── AuthCallbackPage.jsx# OAuth redirect handler
│   │   ├── BrowsePage.jsx      # Browse & search resources
│   │   └── UploadPage.jsx      # Upload a new resource
│   └── lib/
│       └── auth.js             # Auth helpers (token read/write)
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://localhost:4001` |

> All environment variables must be prefixed with `VITE_` to be accessible in the browser at runtime.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js ≥ 18
- The [backend server](../backend/README.md) running (for API calls)

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit VITE_API_BASE_URL if your backend runs on a different port

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## 🗺️ Pages & Routing

| Route | Page | Auth Required | Description |
|---|---|---|---|
| `/` | `LandingPage` | ❌ | Welcome screen with Google sign-in. Auto-redirects to `/browse` if already logged in. |
| `/auth/callback` | `AuthCallbackPage` | ❌ | Handles the OAuth redirect, stores JWT, and forwards the user. |
| `/browse` | `BrowsePage` | ❌ | Browse and search all uploaded resources. |
| `/upload` | `UploadPage` | ✅ | Upload a new academic resource. Redirects to `/` if not authenticated. |
| `*` | — | — | Catch-all redirects to `/`. |

---

## 🔐 Authentication

The app uses **Google OAuth 2.0** delegated to the backend:

1. User clicks **"Sign in with Google"** → Browser navigates to `GET /api/auth/google` on the backend.
2. After Google consent, the backend redirects to `/auth/callback?token=<jwt>`.
3. `AuthCallbackPage` extracts the token, saves it to `localStorage`, and navigates the user forward.
4. All subsequent API requests include `Authorization: Bearer <token>`.
5. Clicking **logout** removes the token from `localStorage` and returns to the landing page.

---

## 🧱 Key Components

### `Navbar`
- Shows app title/logo and navigation links.
- Conditionally renders **Login** or **Logout** based on auth state.

### `ProtectedRoute`
- Wraps routes that require authentication.
- Redirects unauthenticated users to `/`.

### `ResourceCard`
- Displays resource metadata: title, subject, semester, type, uploader, and vote counts.
- Includes **upvote / downvote** buttons (requires auth to interact).
- Provides **View** and **Download** action links.

---

## 📦 Build for Production

```bash
npm run build
```

Output is placed in the `dist/` folder. Serve it with any static file server or CDN.

```bash
# Preview the production build locally
npm run preview
```

---

## 📝 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |

---

## 🔗 Related

- [Backend README](../backend/README.md) — API server setup and documentation

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
