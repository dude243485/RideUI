import "./config/environment.js";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./services/socket.js";

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Create HTTP server and initialize Socket.io
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app, server };