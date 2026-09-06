# Creator Contest Platform

A full-stack, microservice-based platform for running a month-long, category-based content creation contest. Creators sign up, post content, and earn engagement (likes, comments, views); admins track leaderboards, generate winners according to a fixed prize structure, and manage KYC verification before prizes are finalized.

## Architecture

The project is split into three independently deployable services plus a shared frontend, orchestrated with Docker Compose.


                     ┌─────────────────────┐
                     │      Frontend        │
                     │  React + Vite (5173) │
                     └──────────┬───────────┘
                                │
                 ┌──────────────┴───────────────┐
                 │                               │
        Public / user-facing              Admin-only calls
                 │                               │
                 ▼                               ▼
      ┌────────────────────┐          ┌─────────────────────┐
      │   User Service      │          │   Admin Service      │
      │   Express (5000)    │◀────────▶│   Express (6001)     │
      │                      │ internal │                       │
      │   MongoDB (27017)    │  API key │   PostgreSQL (5432)   │
      └────────────────────┘          └─────────────────────┘


- **User Service** — owns creator accounts and content (MongoDB / Mongoose).
- **Admin Service** — owns contest logic: rankings, prize allocation, winners, KYC (PostgreSQL / Prisma).
- The Admin Service never touches MongoDB directly; it fetches user/post data from the User Service's internal API, authenticated with a shared `INTERNAL_API_KEY`.
- **Frontend** — React app serving both the creator-facing site and the admin dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router 7, Axios |
| User Service | Node.js, Express 5, MongoDB, Mongoose, JWT, Multer |
| Admin Service | Node.js, Express 5, PostgreSQL, Prisma 7, JWT |
| Infra | Docker, Docker Compose |

## Project Structure


creator-contest/
├── docker-compose.yml
├── frontend/                # React + Vite app
│   └── src/
│       ├── api/             # axios clients (userApi.js, adminApi.js)
│       ├── components/      # Navbar, AdminNavbar, PostCard, ProtectedRoute
│       └── pages/           # Signup, Login, Feed, CreatePost, Profile,
│                             # AdminLogin, AdminDashboard, AdminRankings, AdminWinners
├── user-service/            # Creator accounts + content (MongoDB)
│   └── src/
│       ├── controllers/     # auth, user, post, interaction, internal
│       ├── models/          # User, Post, Like, Comment
│       ├── routes/
│       ├── middleware/      # authMiddleware, internalAuthMiddleware, uploadMiddleware
│       └── constants/       # POST_CATEGORIES
└── admin-service/           # Contest logic (PostgreSQL / Prisma)
    ├── prisma/               # schema.prisma, migrations
    └── src/
        ├── controllers/     # admin, ranking, prize, winner, kyc, userData
        ├── services/         # rankingService, prizeService, winnerService, cascadeService
        ├── routes/
        └── middleware/       # adminAuthMiddleware


## Features

- Creator signup/login, profile management with residency field
- Post creation with image/video upload, captions, and 10 fixed categories
- Likes, comments, and view tracking on posts
- **Global ranking** — best post per creator, ranked across everyone
- **Category ranking** — best post per creator, ranked within each category
- **Consistency ranking** — rewards creators who post steadily across all 4 contest weeks
- **Automated prize allocation** — Grand Prize → Consistency 1st/2nd → 10 Top Performers → Category 1st → Category 2nd, with each creator winning at most once
- **KYC workflow** — winners must pass KYC before a prize is finalized; a failed KYC automatically cascades the prize to the next eligible creator in that slot
- Separate admin authentication and dashboard, isolated from creator accounts

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Node.js 18+ (only needed for local development outside Docker)

## Getting Started

1. **Clone the repository**

   bash
   git clone <repo-url>
   cd creator-contest
   ```

2. **Start all services**

   bash
   docker compose up --build
   ```

   This launches MongoDB, PostgreSQL, the User Service, the Admin Service, and the frontend.

3. **Run Admin Service database migrations** (first run only)

   bash
   docker compose exec admin-service npm run prisma:deploy
   ```

4. **(Optional) Seed sample data** for the User Service

   bash
   docker compose exec user-service npm run seed
   ```

5. **Open the app**

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - User Service API: [http://localhost:5000](http://localhost:5000)
   - Admin Service API: [http://localhost:6001](http://localhost:6001)

## Environment Variables

Set in `docker-compose.yml` (override for production/local use):

| Variable | Service | Description |
|---|---|---|
| `MONGO_URI` | user-service | MongoDB connection string |
| `JWT_SECRET` | user-service, admin-service | Signs/verifies JWTs (use different secrets per service) |
| `INTERNAL_API_KEY` | user-service, admin-service | Shared secret for admin → user internal API calls |
| `DATABASE_URL` | admin-service | PostgreSQL connection string (Prisma) |
| `USER_SERVICE_URL` | admin-service | Base URL of the User Service |
| `CONTEST_START_DATE` | admin-service | ISO date anchoring the 4-week consistency cycle |
| `PORT` | user-service, admin-service | Service listen port |

> ⚠️ Replace all default secrets (`JWT_SECRET`, `INTERNAL_API_KEY`, database credentials) before deploying to production.

## API Overview

### User Service (`:5000`)

| Method | Route | Auth |
|---|---|---|
| POST | `/auth/signup`, `/auth/login` | — |
| GET | `/users/me` | User JWT |
| PUT | `/users/profile` | User JWT |
| GET/POST | `/posts` | User JWT |
| POST | `/posts/:id/like`, `/comment`, `/view` | User JWT |
| GET | `/internal/users`, `/internal/posts` | Internal API key |

### Admin Service (`:6001`)

| Method | Route | Purpose |
|---|---|---|
| POST | `/admin/signup`, `/admin/login` | Admin auth |
| GET | `/rankings/global`, `/category`, `/consistency` | Leaderboards |
| GET | `/prizes/generate` | Preview prize allocation (dry run) |
| GET | `/winners/generate` | Compute and persist winners |
| GET | `/winners` | List saved winners |
| POST | `/kyc/winners/:winnerId/kyc` | Request KYC |
| POST | `/kyc/winners/:winnerId/kyc/pass` \| `/fail` | Mark KYC result |
| GET | `/data/users`, `/data/posts` | Proxy to User Service (for dashboard) |

Full endpoint and logic details are in [`docs/PROJECT_DOCUMENTATION.pdf`](./docs/PROJECT_DOCUMENTATION.pdf) (or see the Documentation section below).

## Scoring & Prize Logic (Summary)


score = likes + (comments × 3) + (views × 0.2)


- Each ranking reduces every creator to their **single best post** before comparing across creators.
- Ties break by comments → views → earliest post.
- Consistency ranking requires **≥3 posts in each of the 4 contest weeks**.
- Prizes are allocated in strict priority order and **no creator wins more than once**; unfilled category slots are never backfilled from another category.
- A winner who fails KYC is automatically replaced by the next eligible creator for that exact prize slot.

## Development (without Docker)

Each service can also be run locally:

bash
# User Service
cd user-service
npm install
npm run dev        # nodemon, expects a local MongoDB instance

# Admin Service
cd admin-service
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev         # nodemon, expects a local PostgreSQL instance

# Frontend
cd frontend
npm install
npm run dev

