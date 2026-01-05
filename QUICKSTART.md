# Quick Start Guide

Get your Blind Test Bar App running in 5 minutes!

## Step 1: Run Setup

```bash
node setup.js
```

Follow the prompts to configure your app. You can skip Spotify credentials for now.

## Step 2: Install Dependencies

```bash
npm run install:all
```

This will install all required packages for both backend and frontend.

## Step 3: Start the App

```bash
npm run dev
```

This starts both the backend server (port 3001) and frontend (port 3000).

## Step 4: Try It Out

Open three browser windows/tabs:

1. **DJ Panel**: http://localhost:3000/dj
   - Create a game
   - Add some questions manually
   - Note the game code

2. **Player**: http://localhost:3000/play?code=GAMECODE
   - Replace GAMECODE with your actual code
   - Quick join with a username
   - Wait for the game to start

3. **Display**: http://localhost:3000/display
   - Enter your game code
   - See the leaderboard in real-time

## Step 5: Play!

Back in the DJ Panel:
1. Click "Start Question" to begin
2. In the Player window, select an answer
3. Click "End Question" to reveal the correct answer
4. Watch the leaderboard update!

## What's Next?

### Add Spotify Integration

1. Create a Spotify app at https://developer.spotify.com/dashboard
2. Get your Client ID and Client Secret
3. Add them to `backend/.env`:
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```
4. Restart the backend: `cd backend && npm run dev`
5. Now you can search Spotify in the DJ Panel!

### Deploy to Production

See [SETUP.md](SETUP.md) for production deployment instructions.

### Customize

- Change colors in `frontend/tailwind.config.js`
- Adjust time limits when creating games
- Modify scoring in `backend/src/services/gameService.ts`

## Troubleshooting

**Backend won't start?**
- Make sure port 3001 is available
- Check `backend/.env` exists

**Frontend won't connect?**
- Make sure backend is running first
- Check `frontend/.env` has correct API URL

**Can't join game?**
- Make sure you're using the correct game code
- Check that the game status is "WAITING" or "ACTIVE"

## Need Help?

- Full setup guide: [SETUP.md](SETUP.md)
- Project docs: [README.md](README.md)
- Check backend logs for errors
- Check browser console for frontend errors

Have fun! 🎵
