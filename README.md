# AI-Pass Frontend

A React + Tailwind frontend for the [AI-Pass backend](https://ai-pass-backend-7zli.onrender.com)

## Live Demo

- **Live URL:** `https://ai-pass-frontend-five.vercel.app/login`
- **Backend API:** https://ai-pass-backend-7zli.onrender.com
- **API Docs:** https://ai-pass-backend-7zli.onrender.com/swagger-ui.html

> ⏱️ The backend is hosted on Render's free tier and sleeps after 15 minutes of inactivity. The first request may take ~60–120 seconds while it wakes up.

## Stack

- **React 18** + **Vite** (fast SPA)
- **React Router 6** (client-side routing)
- **Tailwind CSS** (utility-first styling)
- **Axios** (HTTP client with JWT interceptor)
- **lucide-react** (icons)
- **react-hot-toast** (notifications)

## Frontend Architecture

```
src/
├── api/                  # axios client + per-resource modules
│   ├── client.js         # axios instance with auth interceptor
│   ├── auth.js
│   ├── tasks.js
│   └── agents.js
├── auth/                 # auth context + protected route
│   ├── AuthContext.jsx
│   └── ProtectedRoute.jsx
├── components/
│   ├── Layout.jsx        # sidebar + topbar shell
│   ├── Sidebar.jsx
│   └── ui/               # Button, Card, Input, Badge, EmptyState
└── pages/
    ├── Login.jsx
    ├── Register.jsx
    ├── Dashboard.jsx
    ├── TaskCreate.jsx
    ├── TaskHistory.jsx
    ├── TaskDetails.jsx
    ├── Agents.jsx
    └── Apps.jsx
```

### Routing

A single `<BrowserRouter>` defines two zones:

- **Public routes** (`/login`, `/register`) render outside the app shell.
- **Protected routes** are wrapped in `<ProtectedRoute>` + `<Layout>`, so they all share the sidebar/topbar and redirect to `/login` if no JWT is present.

### State Management

No global state library — just React's built-in `useState`/`useEffect` per page and a small `AuthContext` for the logged-in user. The app is read-heavy and each page fetches its own data, so a Redux/Zustand setup would be overkill.

### Styling

Tailwind only, with one custom color (`brand`) used consistently for primary actions, active nav, and accents. UI primitives (`Button`, `Card`, `Input`, `Badge`) live in `src/components/ui/` and are reused across every page for a consistent feel.

### Responsive Design

The layout collapses gracefully:

- **Desktop:** sidebar + content
- **Tablet:** same, denser
- **Mobile:** sidebar slides in via hamburger menu; tables convert to card lists

## API Integration Approach

### Authentication

- On login/register, the JWT returned by `/auth/login` or `/auth/register` is stored in `localStorage` along with the user's email and role.
- An **axios request interceptor** attaches `Authorization: Bearer <token>` to every outgoing request automatically.
- An **axios response interceptor** watches for `401` responses, clears storage, and redirects to `/login` — handling expired tokens transparently.
- On reload, `AuthContext` rehydrates the user from `localStorage`, giving session persistence with no extra calls.

### Endpoints used

| Page         | Endpoint                               |
| ------------ | -------------------------------------- |
| Login        | `POST /auth/login`                     |
| Register     | `POST /auth/register`                  |
| Dashboard    | `GET /tasks` (for stats + recent list) |
| Task Create  | `POST /tasks`                          |
| Task History | `GET /tasks`                           |
| Task Details | `GET /tasks/{id}`                      |
| Agents       | `GET /agents`, `POST /agents/run`      |

### Error Handling

Every API call is wrapped in `try/catch`, with `react-hot-toast` notifications for errors and successes — so the user always gets immediate feedback. The 401 case is handled globally by the interceptor.

### Environment Configuration

The backend URL is read from `VITE_API_URL` (set in `.env` locally and in Vercel's environment variables for production). This means the same build can target a local backend during dev and the live one in production with no code change.

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repo.
3. **Framework Preset:** Vite (auto-detected).
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment Variables:**
   - `VITE_API_URL` = `https://ai-pass-backend-7zli.onrender.com`
7. Click Deploy.

The included `vercel.json` rewrites all routes to `/` so React Router's client-side routes (e.g. `/tasks/5`) work on direct page loads and refreshes.

## Future Improvements

- **TypeScript** — type-safe API contracts shared between frontend and a future backend OpenAPI generator
- **TanStack Query** — automatic caching, refetching, optimistic updates instead of manual `useEffect`/`useState`
- **Skeleton loaders** — replace the simple "Loading…" text with shimmer placeholders for a smoother feel
- **Dark mode** — Tailwind's `dark:` variants would be ~1 hour of polish
- **Real-time updates** via WebSockets when tasks switch from PENDING → COMPLETED (once the backend goes async)
- **Functional AI-Pass Apps** — wire each placeholder card to actual specialized workflows on the backend
- **Better empty/error states** with illustrations
- **End-to-end tests** with Playwright covering the auth → create task → view details flow

## Notes

The UI design and styling decisions in this project were assisted by AI. Architecture, API integration logic, state flow, and routing were designed and verified by me. Disclosing this transparently in the spirit of the original backend submission.
