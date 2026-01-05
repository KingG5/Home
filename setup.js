#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('\n🎵 Blind Test Bar App - Setup Wizard\n');
  console.log('This wizard will help you configure your application.\n');

  // Backend .env
  console.log('--- Backend Configuration ---\n');

  const port = await question('Backend port (default: 3001): ') || '3001';
  const jwtSecret = await question('JWT Secret (or press Enter for random): ') ||
    Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

  console.log('\nTo use Spotify integration, you need to create a Spotify App:');
  console.log('1. Go to https://developer.spotify.com/dashboard');
  console.log('2. Create a new app');
  console.log('3. Get your Client ID and Client Secret\n');

  const spotifyClientId = await question('Spotify Client ID (optional, press Enter to skip): ');
  const spotifyClientSecret = spotifyClientId ?
    await question('Spotify Client Secret: ') : '';

  const frontendUrl = await question('Frontend URL (default: http://localhost:3000): ') ||
    'http://localhost:3000';

  // Create backend .env
  const backendEnv = `PORT=${port}
NODE_ENV=development

# JWT
JWT_SECRET=${jwtSecret}

# Database
DATABASE_URL=sqlite:./database.sqlite

# Spotify API
SPOTIFY_CLIENT_ID=${spotifyClientId}
SPOTIFY_CLIENT_SECRET=${spotifyClientSecret}

# CORS
FRONTEND_URL=${frontendUrl}
`;

  fs.writeFileSync(path.join(__dirname, 'backend', '.env'), backendEnv);
  console.log('\n✅ Backend .env file created');

  // Frontend .env
  console.log('\n--- Frontend Configuration ---\n');

  const backendUrl = `http://localhost:${port}`;

  const frontendEnv = `REACT_APP_API_URL=${backendUrl}
REACT_APP_SOCKET_URL=${backendUrl}
`;

  fs.writeFileSync(path.join(__dirname, 'frontend', '.env'), frontendEnv);
  console.log('✅ Frontend .env file created');

  console.log('\n✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Install dependencies: npm run install:all');
  console.log('2. Start development servers: npm run dev');
  console.log('\nOr install and start in one command:');
  console.log('npm run install:all && npm run dev\n');

  rl.close();
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
