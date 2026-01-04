// const express = require("express"); // using type commonjs
import "dotenv/config";
import express from "express"; // using type module
import { connectDB, disconnectDB } from "./config/db.js";

// 1. Import Routers
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

connectDB();

// Instance of our Express application
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

// Start the server on specified PORT
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, "0.0.0.0", () => {
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
