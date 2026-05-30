const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const { app } = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

const { initSocket } = require("./config/socket");

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = initSocket(server);

  // Export io for other modules if needed
  app.set("io", io);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
