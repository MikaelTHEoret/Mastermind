
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { DatabaseManager } from '../core/database/DatabaseManager';

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Database Initialization
const dbManager = new DatabaseManager();
dbManager.connect()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection failed:", err));

// Create HTTP server and WebSocket server
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Define WebSocket behavior
wss.on('connection', ws => {
  console.log("New WebSocket connection established");
  ws.on('message', message => console.log("Received:", message));
});

// Define routes
app.get('/status', (req, res) => res.json({ status: 'ok' }));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
