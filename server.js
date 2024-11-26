import express, { json } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(json());

// Endpoint API untuk menerima data donasi
app.post("/donations", (req, res) => {
  const donation = req.body;
  console.log("Received donation:", donation); // Debug log

  // Broadcast event ke semua klien
  io.emit("newDonation", donation);

  res.status(200).json({ message: "Donation received", data: donation });
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start Server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
