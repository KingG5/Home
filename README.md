# Blind Test Bar App

A real-time blind test (music quiz) application for bars, featuring player interaction via QR codes, DJ control panel, and live display screens.

## Features

### Player Features
- 🎵 Scan QR code to join game
- 👤 Quick signup/login
- ⏱️ Time-limited answer selection
- 📊 Real-time score updates
- 🏆 Live leaderboard

### DJ/Admin Features
- 🎛️ Control panel for game management
- 🎵 Spotify playlist integration
- 🎚️ Serato compatibility (manual track selection)
- ⏰ Configurable answer time limits
- 📊 Game session management

### Display Features
- 📺 Large screen display for bar
- 🏅 Live leaderboard
- 👥 Active players list
- 🎵 Current question display
- ⏱️ Timer visualization

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- Socket.io (real-time communication)
- SQLite/PostgreSQL (database)
- JWT (authentication)
- Spotify Web API

### Frontend
- React + TypeScript
- Socket.io Client
- TailwindCSS (styling)
- QR Code generation/scanning

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Players   │     │     DJ      │     │   Display   │
│  (Mobile)   │     │   Panel     │     │   Screen    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Backend   │
                    │  (Express)  │
                    │  Socket.io  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Database   │
                    └─────────────┘
```

## Project Structure

```
blind-test-bar-app/
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── socket/        # Socket.io handlers
│   │   ├── middleware/    # Auth, validation
│   │   └── server.ts      # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   │   ├── Player/    # Player interface
│   │   │   ├── DJ/        # DJ control panel
│   │   │   └── Display/   # Bar display screen
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Spotify Developer Account (optional, for Spotify integration)

### Automated Setup

```bash
# Run the setup wizard
node setup.js

# Install all dependencies
npm run install:all

# Start both backend and frontend
npm run dev
```

The setup wizard will configure your environment variables automatically.

### Manual Setup

See [SETUP.md](SETUP.md) for detailed manual setup instructions.

### Access the Application

Once running, access:
- **Home**: `http://localhost:3000`
- **Players**: `http://localhost:3000/play`
- **DJ Panel**: `http://localhost:3000/dj`
- **Display Screen**: `http://localhost:3000/display`

## Game Flow

1. **Setup**: DJ creates a game session and generates QR code
2. **Join**: Players scan QR code and login/signup
3. **Play**: DJ plays track, question appears with timer
4. **Answer**: Players select answer before time runs out
5. **Score**: Points awarded for correct answers (bonus for speed)
6. **Repeat**: Continue with next question
7. **Winner**: Display final leaderboard

## Spotify Integration

The app integrates with Spotify Web API to:
- Browse playlists
- Search tracks
- Fetch track metadata (artist, title, album)
- Preview audio (30-second clips)

### Serato Workflow

Since Serato doesn't have a public API, the DJ can:
1. Play track in Serato as usual
2. Manually select the track in the DJ panel (search by name)
3. Or use Spotify integration to browse/select tracks

## Features Status

- ✅ Project setup and architecture
- ✅ Backend API and Socket.io
- ✅ Database models with Sequelize
- ✅ Authentication system (quick join, login, signup)
- ✅ Player interface with real-time gameplay
- ✅ DJ control panel with game management
- ✅ Display screen for bar (leaderboard & questions)
- ✅ Spotify integration (search & import tracks)
- ✅ Real-time game logic with Socket.io
- ✅ QR code generation for easy access
- ✅ Timer system with visual feedback
- ✅ Scoring system (points based on speed)
- ✅ Live leaderboard updates

## Usage Guide

### For Bar Owners/DJs

1. Open the DJ Panel: `http://localhost:3000/dj`
2. Create a new game with a name and time limit
3. A QR code will be generated - display this at your bar
4. Add questions:
   - **Spotify Search**: Search and import tracks directly
   - **Manual Entry**: Add custom questions with multiple choice answers
5. Open Display Screen on a big TV: `http://localhost:3000/display`
6. Control the game:
   - Start each question when ready
   - Music plays (via Serato or your DJ setup)
   - Players answer on their phones
   - End the question to reveal the answer
   - Watch the leaderboard update in real-time

### For Players

1. Scan the QR code displayed at the bar
2. Choose Quick Join and enter your name
3. Wait for the game to start
4. When a song plays:
   - Select your answer from 4 options
   - Faster correct answers = more points!
5. Watch your rank on the leaderboard
6. Compete to reach the top!

### Serato Integration Notes

Since Serato doesn't have a public API, the workflow is:

1. DJ prepares questions beforehand using Spotify search
2. DJ plays the track in Serato
3. DJ clicks "Start Question" in the control panel at the same time
4. Players hear the track and answer on their phones
5. DJ clicks "End Question" to reveal the answer

Alternatively, you can use the Spotify preview URLs for fully automated playback (30-second clips).

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
