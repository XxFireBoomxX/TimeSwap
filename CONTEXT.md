# Timeswap Project – Full AI/Dev Context

## Overview

**Timeswap** is a full-stack SaaS application designed as a task/reward marketplace, focused on student communities or skill-sharing circles.  
Users can post, claim, and complete tasks for reputation and (optionally) rewards.

---

## Project Structure

<details>
<summary>Directory Layout</summary>

client/ # React (Vite, TypeScript) Frontend
│
├─ src/
│ ├─ assets/ # Static assets (SVG, etc.)
│ ├─ pages/ # Main page-level React components
│ │ ├─ Login.tsx # Login page logic (with axios)
│ │ └─ Login.css # Login page styles (modern, purple-accented)
│ ├─ api.ts # Axios API wrapper functions
│ ├─ App.tsx # Main React App
│ ├─ App.css # Main app-wide styles (to extend!)
│ ├─ index.css # Global CSS (reset, basic theming)
│ └─ main.tsx # ReactDOM entry point
│
└─ server/ # Flask + SQLAlchemy Backend (not in screenshot but implied)

</details>

---

## Tech Stack

- **Frontend:** React (with Vite + TypeScript)
- **Backend:** Flask, Flask-JWT-Extended, Flask-SQLAlchemy
- **Database:** (default: SQLite for dev), upgradable to PostgreSQL/MySQL
- **API:** REST, JSON (auth endpoints, task CRUD, user profile, etc.)
- **Design:** Modern, card-based UI with purple accent (`#8e24aa`), animated transitions, clean spacing

---

## Main Features (current & planned)

### 1. User Auth

- JWT-based login/register
- Axios POSTs to `/auth/login`
- Token stored in state (can be lifted up for context/global auth)

### 2. Tasks

- Model: `Task` (title, description, deadline, reward, status, created_by, claimed_by, created_at)
- Users can **create**, **claim**, **complete** tasks.
- Relational DB: `created_by` and `claimed_by` are Foreign Keys to User.

### 3. User Model

- Model: `User` (id, username, email, password_hash, reputation, created_at, role)
- Reputation system: starts at 5.0, can grow or drop

### 4. Design System

- Login uses custom CSS (`Login.css`) with:
  - White card, purple shadow/accents
  - Clean input fields, focus transitions, error animation
  - Mobile-friendly and animated
- Plan: reuse this for all pages for visual consistency

---

## Frontend Details

- **Login page:** `pages/Login.tsx`, styled with `pages/Login.css` (purple, white, and soft drop-shadows, animated shake on error)
- **App.tsx:** Main React entry point, handles page routing/layout
- **api.ts:** All API calls are centralized here for ease of use and potential token injection
- **Routing:** _Currently not shown, but recommended via react-router-dom for SPA navigation._

---

## Backend Details

- **Flask app** serves the API on `localhost:5000`
- **Endpoints:** `/auth/login`, `/tasks`, etc.
- **Models:**
  - `User` – Table: `users`
  - `Task` – Table: `tasks` (with FKs to `users`)
- **Error handling:** Uses Flask-JWT for route protection

---

## Development/Run Instructions

### Frontend

```bash
cd client
npm install
npm run dev
```

- Main dev entry: src/main.tsx

- Pages/components live under src/pages

# Setup your virtualenv, install dependencies, set FLASK_APP, then:

flask run

Code is split by blueprints/modules (routes/tasks.py, etc.)

Database migration with Flask-Migrate or by hand

# Key Visual/Style Guidelines

- White card background, purple (#8e24aa) for highlights/buttons/headers

- Subtle shadow, rounded corners

- Inputs with clear focus states

- Error messages animate (shake)

- Everything is mobile-first, but desktop-polished

# TODO / Roadmap

- Add registration page with same design

- Task list/dashboard (styled like login card)

- User profile/settings

- Global state management for JWT token (React context/redux)

- Routing (react-router)

- Backend: task status change endpoints, reputation logic, error reporting

- Production Dockerization

# Files/Folders Quick Map

File/Fldr Description
src/pages/Login.tsx Login page component (React)
src/pages/Login.css Login page design (main style reference)
src/api.ts Axios API calls (auth, tasks, etc)
src/App.tsx React entry/layout point
src/App.css Global App styling
src/index.css CSS reset/base (extends App.css)
server/models/user.py User SQLAlchemy model
server/models/task.py Task SQLAlchemy model
server/routes/\* API routes (auth, tasks, users, etc)

# How to Add New Pages

Copy the card layout and CSS from Login.css – use it as a base for all forms/pages for visual unity.

Create a new TSX component under src/pages/, e.g. Dashboard.tsx.

Import the same CSS or extract common styles to App.css as project grows.

# AI/Contributor Tips

Consistent naming: files use PascalCase for components, kebab-case for css.

Keep color scheme: If adding new components, follow purple/white/soft shadow palette.

API requests: Always use the centralized api.ts for all API calls.

State: Pass auth token via React context or props as needed.

Last updated: 2025-05-18
