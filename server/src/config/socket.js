const { Server } = require("socket.io");

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      if (!userId) return;
      socket.join(String(userId));
    });
  });

  return io;
};

module.exports = { initSocket };
