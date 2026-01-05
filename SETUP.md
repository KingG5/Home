# Setup Guide

Complete guide to setting up and running the Blind Test Bar App.

## Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (version 18 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blind-test-bar-app
```

### 2. Run Setup Wizard

```bash
node setup.js
```

The setup wizard will guide you through:
- Configuring backend port
- Setting JWT secret
- Adding Spotify credentials (optional)
- Setting frontend URL

### 3. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for both backend and frontend.

### 4. Start Development Servers

```bash
npm run dev
```

This starts both backend (port 3001) and frontend (port 3000) concurrently.

## Manual Setup

If you prefer manual setup instead of the wizard:

### Backend Configuration

1. Copy the example environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `backend/.env` and configure:
   - `JWT_SECRET`: A secure random string
   - `SPOTIFY_CLIENT_ID`: Your Spotify app client ID (optional)
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify app client secret (optional)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start backend:
   ```bash
   npm run dev
   ```

### Frontend Configuration

1. Copy the example environment file:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Edit `frontend/.env` if needed (defaults should work)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start frontend:
   ```bash
   npm start
   ```

## Spotify Integration Setup

To use Spotify features (searching tracks, importing playlists):

1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app details:
   - App name: "Blind Test Bar App"
   - App description: "Music quiz application"
   - Redirect URI: `http://localhost:3000` (not used but required)
5. Click "Show Client Secret"
6. Copy both Client ID and Client Secret
7. Add them to `backend/.env`:
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

## Serato Integration

Serato doesn't have a public API, so the DJ workflow is:

1. DJ plays track in Serato
2. DJ manually searches for the track in the DJ panel (using Spotify search)
3. DJ adds the track as a question
4. DJ starts the question when ready

Alternatively, the DJ can prepare questions ahead of time from a Spotify playlist.

## Production Deployment

### Backend

1. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

2. Set production environment variables:
   ```bash
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   FRONTEND_URL=https://yourdomain.com
   ```

3. Start the production server:
   ```bash
   npm start
   ```

### Frontend

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the build folder with a static file server (nginx, Apache, etc.)

### Database

For production, consider using PostgreSQL instead of SQLite:

1. Install PostgreSQL
2. Create a database
3. Update `DATABASE_URL` in backend/.env:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/blindtest
   ```

## Troubleshooting

### Backend won't start

- Check if port 3001 is already in use: `lsof -i :3001`
- Verify Node.js version: `node --version` (should be 18+)
- Check logs for specific error messages

### Frontend won't connect to backend

- Verify backend is running on port 3001
- Check `REACT_APP_API_URL` in `frontend/.env`
- Check browser console for CORS errors

### Spotify search not working

- Verify Spotify credentials are correct in `backend/.env`
- Check backend logs for Spotify API errors
- Ensure Spotify app is not in development mode restriction

### Database errors

- Delete `backend/database.sqlite` and restart backend
- Sequelize will recreate tables automatically in development mode

### Socket.io connection issues

- Check firewall settings
- Verify `REACT_APP_SOCKET_URL` in `frontend/.env`
- Check browser console for WebSocket errors

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the README.md for feature documentation
3. Open an issue on GitHub

## Development Tips

### Hot Reload

Both backend and frontend support hot reload:
- Backend: Changes to `.ts` files automatically restart the server
- Frontend: Changes to React components automatically refresh the browser

### Database Reset

To reset the database:
```bash
cd backend
rm database.sqlite
# Restart backend - it will recreate the database
```

### Adding Environment Variables

1. Add to `.env.example` file
2. Add to actual `.env` file
3. Update `setup.js` if the variable should be configured during setup
4. Document in SETUP.md

### Port Configuration

Change ports in:
- Backend: `backend/.env` - `PORT=3001`
- Frontend: Uses default Create React App port 3000
  - To change: `PORT=3001 npm start`
