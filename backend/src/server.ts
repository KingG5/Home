import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { connectDatabase } from './models';
import { GameSocketHandler } from './socket/gameSocket';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Socket.io handlers
const gameSocketHandler = new GameSocketHandler(io);
io.on('connection', (socket) => {
  gameSocketHandler.handleConnection(socket);
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    httpServer.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🎵 Blind Test Bar App Server 🎵    ║
╚════════════════════════════════════════╝

✅ Server running on port ${PORT}
✅ WebSocket server running
✅ Database connected

🌐 API: http://localhost:${PORT}
🔌 Socket.io: ws://localhost:${PORT}

📋 Endpoints:
   - POST /auth/signup
   - POST /auth/login
   - POST /auth/quick-join
   - POST /api/games
   - GET  /api/games/:code
   - GET  /health

Ready to rock! 🎸
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };
