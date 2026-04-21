/**
 * Express app configuration.
 * Sets up middleware (CORS, JSON parsing) and base routes.
 */

import express from "express";
import cors from "cors";
import slaRoutes from "./routes/slaRoutes";

/**
 * Express App configuration.
 * Middleware setup (CORS, JSON parsing) and base routes.
 */
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api", slaRoutes);

export default app;
