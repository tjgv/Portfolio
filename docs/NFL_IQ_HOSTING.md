# Hidden NFL IQ page

**Portfolio root:** `/Users/tejimoto/Desktop/MAIN PORTFOLIO` (deploy this folder to Vercel).

## Hidden URL

**`https://tjgomezvidal.com/giq`**

Not linked from the homepage or nav — only people with this URL can open it.

## Local test

```bash
cd "/Users/tejimoto/Desktop/MAIN PORTFOLIO"
npm run build:nfl-iq
npm run build
npm run preview
```

Open `http://localhost:4177/giq`

## Vercel

1. Project root = **MAIN PORTFOLIO**
2. `npm run build` (bundles NFL IQ into `public/giq`, then builds the site)
3. For CI: include NFL IQ source via `projects/nfl-iq` submodule or set `NFL_IQ_PROJECT_PATH`

Sibling folder `../Genius-Take-Home-Assignment` works on your Mac only, not on Vercel unless that repo is part of the deploy.
