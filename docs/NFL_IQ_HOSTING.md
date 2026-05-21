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
3. NFL IQ source is vendored at `projects/nfl-iq/` (used by Vercel). To refresh from your Desktop project:

   ```bash
   rsync -a --delete --exclude node_modules --exclude dist \
     ../Genius-Take-Home-Assignment/ projects/nfl-iq/
   ```

   Override path with `NFL_IQ_PROJECT_PATH` if needed.
