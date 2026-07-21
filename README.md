# Personal Finance Tracker

A Next.js personal finance dashboard for tracking monthly salary, category-based budgets, and spending in **PKR**. Built with Tailwind CSS, Supabase, and Google authentication.

## Features

- **Monthly salary** in PKR with automatic category budget allocation
- **5 budget categories** with fixed percentages:
  - Household Expenses — 35%
  - Car Expenses — 15%
  - Investments — 25%
  - Dine Outs & Shopping — 15%
  - Savings / Emergency — 10%
- **Overspending alerts** when a category exceeds its budget
- **Savings alert** when remaining balance falls below the 10% savings target
- **Dashboard** with metrics, radar chart, bar chart, pie chart, and daily spending trend
- **Monthly history** — navigate between months; data persisted in Supabase
- **Google sign-in** via Supabase Auth

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **SQL Editor**, run the contents of `supabase/schema.sql`.
3. In **Authentication → Providers**, enable **Google** and add your OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/).
4. In **Authentication → URL Configuration**, set:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase keys from **Project Settings → API Keys**:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — safe for browser/client code (`sb_publishable_...`)
- `SUPABASE_SECRET_KEY` — server-only, never expose to the client (`sb_secret_...`)

```bash
cp .env.local.example .env.local
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Auth + PostgreSQL)
- [Recharts](https://recharts.org/) for charts
- [Lucide React](https://lucide.dev/) for icons

## Project Structure

```
src/
├── app/                  # Routes (login, dashboard, auth callback)
├── components/           # UI components
├── lib/                  # Finance logic, Supabase clients, formatting
└── types/                # TypeScript types
supabase/
└── schema.sql            # Database schema + RLS policies
```
