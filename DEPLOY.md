# 🌸 Floral Scentora — Vercel Deployment Guide

Deploy the complete Floral Scentora website to Vercel in **5 steps**.
No server required — everything runs on Vercel's edge + Supabase cloud DB.

---

## Architecture

```
GitHub Repo
  ├── frontend/          React + Vite app  (builds → /dist)
  ├── api/               Vercel Serverless Functions (Node.js)
  │   ├── products.js         GET all / POST new product
  │   ├── products/[id].js    GET / PUT / DELETE single product
  │   ├── admin/login.js      POST admin passcode check
  │   ├── image-proxy.js      GET image proxy for alqadsiya.com
  │   └── _lib/supabase.js    Shared Supabase client
  ├── supabase/
  │   ├── schema.sql          Run once in Supabase SQL Editor
  │   └── migrate.js          One-time SQLite → Supabase migration
  └── vercel.json             Tells Vercel how to build & route
```

---

## Step 1 — Set Up Supabase Database

1. Go to **[supabase.com](https://supabase.com)** → Create free account
2. Click **New Project** → Name: `floral-scentora` → choose any region → set a DB password
3. Wait ~2 minutes for the project to spin up
4. Go to **SQL Editor** → click **New Query**
5. Paste the entire contents of `supabase/schema.sql` → click **Run**
6. Go to **Project Settings → API** → copy:
   - **Project URL**  (`https://abcdefgh.supabase.co`)
   - **anon / public** key
   - **service_role** key (under "Project API keys")

---

## Step 2 — Create `.env.local` for Local Dev

Create a file called `.env.local` in the project root (it is gitignored):

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ADMIN_PASSCODE=admin123
```

---

## Step 3 — Migrate Products to Supabase (one-time)

This copies all 939+ products from your local SQLite database to Supabase:

```powershell
# From the project root:
npm install
node supabase/migrate.js
```

You should see progress like:
```
📦  Found 939 products in SQLite
✅  Batch 1/10 — 100/939 products (11%)
✅  Batch 2/10 — 200/939 products (21%)
...
🎉  Migration complete!  ✅ Inserted: 939
```

---

## Step 4 — Push to GitHub

```powershell
# From the project root:
git init
git add .
git commit -m "Initial commit — Floral Scentora Vercel deployment"

# Create repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/floral-scentora.git
git branch -M main
git push -u origin main
```

---

## Step 5 — Deploy on Vercel

1. Go to **[vercel.com](https://vercel.com)** → Sign up / Log in with GitHub
2. Click **Add New → Project**
3. Import your **floral-scentora** GitHub repo
4. Vercel auto-detects the `vercel.json` — no framework settings needed
5. Before clicking **Deploy**, go to **Environment Variables** and add:

| Name | Value |
|---|---|
| `SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key |
| `ADMIN_PASSCODE` | `admin123` (or any password you want) |

6. Click **Deploy** → Wait ~1 minute → 🎉 Your site is live!

---

## Local Development (after Vercel setup)

Install the Vercel CLI and run everything locally:

```powershell
npm install                # installs vercel CLI + supabase-js
vercel dev                 # starts frontend + API functions together at localhost:3000
```

> Note: `vercel dev` reads your `.env.local` automatically.

---

## Auto-Deploy on Git Push

After initial setup, every `git push` to `main` automatically triggers a new Vercel deployment. No manual steps needed.

---

## Admin Panel

Visit `https://your-site.vercel.app/admin`
- Default passcode: `admin123` (change via Vercel env var `ADMIN_PASSCODE`)
