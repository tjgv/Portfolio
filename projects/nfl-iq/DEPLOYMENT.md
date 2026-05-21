# Deploying NFL IQ (Genius take-home)

> **Portfolio hosting (your plan):** configure Vercel on **`/Users/tejimoto/Desktop/MAIN PORTFOLIO`**, not this folder.  
> See **`MAIN PORTFOLIO/docs/NFL_IQ_HOSTING.md`** for hidden `/giq` and `/nfl-iq/` setup.

This app can also run **standalone on Vercel** from this repo, or **under your portfolio** at a hidden path.

## Hidden URL on your portfolio (recommended)

The portfolio build bundles this project at **`/nfl-iq/`** (not linked from the homepage).

| URL | Purpose |
|-----|---------|
| `https://your-domain.com/nfl-iq/` | Full NFL IQ prototype |
| `https://your-domain.com/giq` | Short hidden redirect → `/nfl-iq/` |

### One-time setup

1. Put this repo where the portfolio build can find it (pick one):
   - **Sibling folder** (local): `../Genius-Take-Home-Assignment` next to `MAIN PORTFOLIO`
   - **Inside portfolio**: copy or submodule to `MAIN PORTFOLIO/projects/nfl-iq`
   - **Vercel env**: set `NFL_IQ_PROJECT_PATH` to the repo path in your monorepo

2. From `MAIN PORTFOLIO`, install and build (includes NFL IQ):

   ```bash
   npm install
   npm run build
   ```

3. Deploy `MAIN PORTFOLIO` to Vercel as you already do. The `vercel.json` rewrites serve `/nfl-iq/*` as a nested SPA.

### Local preview (portfolio + NFL IQ)

```bash
# Terminal 1 — optional: develop NFL IQ alone
cd Genius-Take-Home-Assignment
npm run dev

# Terminal 2 — portfolio with bundled /nfl-iq
cd "MAIN PORTFOLIO"
npm run build:nfl-iq   # builds into public/nfl-iq
npm run dev            # open http://localhost:5177/nfl-iq/
```

### Skip NFL IQ in a portfolio build

```bash
SKIP_NFL_IQ_BUILD=1 npm run build
```

## Standalone Vercel project

Deploy **this** folder as its own Vercel project (root directory = repo root). No `VITE_BASE_PATH` needed; app lives at `/`.

## API note

Mock data works without the Express server. For live API data on Vercel, add serverless routes or host `npm run server` separately and point the app at that URL.
