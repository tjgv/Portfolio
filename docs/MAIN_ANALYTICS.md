# `/main` visit analytics

Duplicate homepage at **`/main`** with a simple pageview + unique-visitor counter.

## URLs

| URL | Purpose |
| --- | --- |
| `/main` | Tracked homepage duplicate (share this link) |
| `/main?me=1` | Mark **this browser** as you — visits from it are never counted |
| `/main/stats` | Live dashboard: pageviews + unique visitors |

## How it works

1. A visitor opens `/main`.
2. The client creates a stable `main_visitor_id` in `localStorage` (unless this browser is marked as you).
3. `POST /api/main-hit` increments pageviews and records the visitor id.
4. `/main/stats` reads `GET /api/main-stats`.

## Production setup (required for durable counts)

Vercel serverless functions need **Vercel Blob** so counts survive cold starts.

1. In the [Vercel dashboard](https://vercel.com) → your project → **Storage** → create a **Blob** store (or open an existing one).
2. Connect it to this project. Vercel will set `BLOB_READ_WRITE_TOKEN`.
3. Redeploy.

Without the token, the API still runs but stores counts **in memory only** (lost on cold start). The stats page shows `memory` vs `blob` in the footer meta line.

## Local note

Vite alone does not run `/api/*`. Use `vercel dev` (with Blob token in env) to test tracking locally, or verify after deploy.

## Out of scope

- Card click tracking
- Password on `/main/stats`
- Tracking on `/` (root homepage)
