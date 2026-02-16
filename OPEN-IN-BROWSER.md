# View Your Portfolio (Don’t Use Cursor Preview)

Cursor’s built-in preview often **does not** show the latest Vite/React app. Use your normal browser instead.

## Steps

1. **Start the dev server**  
   In Cursor’s terminal (`` Ctrl+` `` or **View → Terminal**), run:
   ```bash
   cd /Users/tejimoto/Desktop/Portfolio
   npm run dev
   ```

2. **Note the URL**  
   You’ll see something like:
   ```text
   ➜  Local:   http://localhost:5173/
   ```
   (The port might be 5174, 5175, etc. if 5173 is in use.)

3. **Open that URL in Chrome, Safari, or Firefox**  
   - Do **not** use “Simple Browser” or “Preview” inside Cursor.  
   - Copy the `http://localhost:5173` (or whatever port) line.  
   - Paste it into the address bar of **Chrome**, **Safari**, or **Firefox** and press Enter.

4. **Hard refresh once**  
   - Mac: **Cmd+Shift+R**  
   - Windows: **Ctrl+Shift+R**

You should see a **green “LIVE” badge** in the bottom-left. If you see it, you’re on the latest build. If you never see it, the preview is still showing an old/cached version.

When you’re sure things work, you can remove the green badge (search for `dev-indicator` and `LIVE` in the repo and delete that block).
