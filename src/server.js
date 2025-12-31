// const express = require("express"); // using type commonjs
import express from "express"; // using type module

// Import Routers
import movieRoutes from "./routes/movieRoutes.js";

// Instance of our Express application
const app = express();

// API Routes
app.use("/movies", movieRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
