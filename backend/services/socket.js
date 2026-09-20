import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/token.js';

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST', 'PATCH'],
      credentials: true,
    },
  });

  // Optional socket auth via token query or auth header
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        socket.user = decoded;
      } catch (err) {
        // Continue unauthenticated, client can join rooms explicitly
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    // If authenticated via token, join user room automatically
    if (socket.user?.sub) {
      socket.join(`user:${socket.user.sub}`);
    }

    // Explicit room registration
    socket.on('join:user', (userId) => {
      if (userId) socket.join(`user:${userId}`);
    });

    socket.on('join:driver', (driverId) => {
      if (driverId) socket.join(`driver:${driverId}`);
    });

    socket.on('join:ride', (rideId) => {
      if (rideId) socket.join(`ride:${rideId}`);
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
}

export function getIO() {
  return io;
}

export function notifyDriverNewRequest(driverId, rideData) {
  if (!io) return;
  io.to(`driver:${driverId}`).emit('ride:requested', rideData);
}

export function notifyRiderMatch(riderId, matchData) {
  if (!io) return;
  io.to(`user:${riderId}`).emit('ride:matched', matchData);
}

export function notifyRiderCancel(riderId, cancelData) {
  if (!io) return;
  io.to(`user:${riderId}`).emit('ride:cancelled', cancelData);
}

export function notifyRideCompleted(riderId, driverId, completionData) {
  if (!io) return;
  if (riderId) io.to(`user:${riderId}`).emit('ride:completed', completionData);
  if (driverId) io.to(`driver:${driverId}`).emit('ride:completed', completionData);
  if (completionData?.rideId) io.to(`ride:${completionData.rideId}`).emit('ride:completed', completionData);
}
