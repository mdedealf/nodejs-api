// const express = require("express"); // using type commonjs
import express from "express"; // using type module
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

// Import Routers
import movieRoutes from "./routes/movieRoutes.js";

config();
connectDB();

// Instance of our Express application
const app = express();

// API Routes
app.use("/movies", movieRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g., DB connection issues)
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown on SIGTERM signal
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
