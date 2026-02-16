# How to Preview Your Portfolio

If you see **"command not found"** when running `bun run dev` or `npm run dev`, you need to install Node.js first (npm comes with it).

---

## Option 1: Install Node.js (recommended)

### On Mac (easiest)
1. Go to **https://nodejs.org**
2. Download the **LTS** version
3. Run the installer
4. **Quit and reopen your terminal** (or restart Cursor)
5. Then run:
   ```bash
   cd /Users/tejimoto/Desktop/Portfolio
   npm run dev
   ```
6. Open **http://localhost:5173** in your browser

### Using Homebrew (if you have it)
```bash
brew install node
```
Then reopen terminal and run `npm run dev` from your project folder.

---

## Option 2: You use Bun

If you prefer Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```
Restart terminal, then:
```bash
cd /Users/tejimoto/Desktop/Portfolio
bun run dev
```

---

## After Node is installed

From your project folder, run **one** of these:

| Command     | When to use        |
|------------|--------------------|
| `npm run dev` | You installed Node from nodejs.org |
| `bun run dev` | You installed Bun  |

You should see:
```
  VITE v7.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

Click the link or open **http://localhost:5173/** in your browser to preview.

---

## Quick check: “Do I have Node?”

In a **new** terminal, run:
```bash
node --version
```
- If you see a version (e.g. `v20.10.0`) → use `npm run dev`
- If you see "command not found" → install Node from https://nodejs.org (Option 1 above)
