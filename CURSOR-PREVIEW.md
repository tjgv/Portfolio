# Use Cursor’s Preview with This Project

The app is a **Vite** dev server. For Cursor’s preview to show the live app, the preview must open the **same URL** as the dev server (e.g. `http://localhost:5177`).

## Steps every time

### 1. Start the dev server

In Cursor’s terminal (**View → Terminal** or `` Ctrl+` ``):

```bash
cd /Users/tejimoto/Desktop/Portfolio
npm run dev
```

Wait until you see something like:

```text
  ➜  Local:   http://localhost:5177/
```

(If 5173 is in use you might see 5174, 5175, etc. Use that URL in step 2.)

### 2. Open Cursor’s Simple Browser on that URL

1. **Command Palette:** `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows).
2. Type **`Simple Browser`** and run **“Simple Browser: Show”** (or “Open in Simple Browser”).
3. In the URL bar of the Simple Browser, enter the URL from step 1, e.g.:
   ```text
   http://localhost:5177
   ```
4. Press Enter.

The preview should show your app and hot-reload when you save.

### 3. If it still shows an old page

- Make sure the **terminal** is running `npm run dev` and shows “ready”.
- In the Simple Browser URL bar, type the same URL again and press Enter (refresh).
- Close the Simple Browser tab and open a new one (step 2) with `http://localhost:5177`.

## Why it broke

Cursor’s preview doesn’t start your dev server. If you open “Preview” or a static file without going to `http://localhost:5177`, you get a different page (or a cached one). Always:

1. Start the dev server in the terminal.
2. Point the Simple Browser at the URL the dev server prints.

## Port

The project is set to prefer port **5177**. If something else is using it, Vite will use the next free port; use whatever URL `npm run dev` prints in step 2.
