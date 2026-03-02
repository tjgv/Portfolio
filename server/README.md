# Workflow API (Discord + Gmail)

This server runs workflow steps (e.g. posting to Discord, reading Gmail) when you click **Run workflow** in the Workflow Builder.

## 1. Install dependencies

From the project root:

```bash
npm install
```

## 2. Create a Discord bot and get the token

1. Open the [Discord Developer Portal](https://discord.com/developers/applications) and create an application (or use an existing one).
2. Go to **Bot** and click **Add Bot**. Copy the **Token** (this is your `DISCORD_BOT_TOKEN`).
3. Under **OAuth2 → URL Generator**, select scopes **bot** and permissions **Send Messages** (and any others you need). Open the generated invite URL and add the bot to your server ([e.g. teji9455's server](https://discord.gg/R95rZsyr)).

## 3. Get your channel ID

In Discord:

1. **User Settings → App Settings → Advanced** → turn on **Developer Mode**.
2. In your server, right‑click the channel you want to post to → **Copy channel ID**. Use this value in the workflow’s Discord action **Channel ID** field.

## 4. Run the API and the app

**Terminal 1 – API (port 3001):**

```bash
DISCORD_BOT_TOKEN=your_bot_token_here npm run server
```

Or create a `.env` in the project root (optional):

```
DISCORD_BOT_TOKEN=your_bot_token_here
```

Then run:

```bash
source .env 2>/dev/null; npm run server
```

**Terminal 2 – Frontend (port 5177):**

```bash
npm run dev
```

Open the Workflow Builder, add a **Discord** action, set **Channel ID** and **Message**, then click **Run workflow**. The message will be posted to your Discord channel.

---

## Gmail (New email received trigger)

To use the **New email received** trigger and have workflows read your latest Gmail:

### 1. Google Cloud setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. **APIs & Services → Library** → search for **Gmail API** → **Enable**.
3. **APIs & Services → Credentials** → **Create credentials** → **OAuth 2.0 Client ID**.
4. If prompted, configure the **OAuth consent screen** (External, add your email as test user).
5. Application type: **Web application**. Name it (e.g. "Workflow Builder").
6. Under **Authorized redirect URIs** add: `http://localhost:3001/api/auth/gmail/callback` (or your API base URL + `/api/auth/gmail/callback`).
7. Create and copy the **Client ID** and **Client secret** into your `.env`:

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
API_BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5177
```

### 2. Link your email

1. Start the API (`npm run server`) and the frontend (`npm run dev`).
2. Open the Workflow Builder page and click **Connect Gmail**.
3. Sign in with Google and allow read access to Gmail. You’ll be redirected back with “Email linked”.

### 3. Use in a workflow

1. Add a **Trigger** node and set its type to **New email received**.
2. Add a **Discord** action and connect it from the trigger.
3. In the Discord message you can use placeholders that are replaced with the **latest email** from your inbox:
   - `{{email.from}}` – sender
   - `{{email.subject}}` – subject
   - `{{email.snippet}}` – short preview
   - `{{email.body}}` – body (truncated)
   - `{{email.date}}` – date header
4. Click **Run workflow**. The server fetches your latest Gmail message and posts to Discord with those values substituted.
