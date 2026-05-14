import express from "express";
import cors from "cors";
import slaRoutes from "./routes/slaRoutes";
import authRoutes from "./routes/authRoutes";
import settingsRouter from "./routes/settingsRoutes";
import historyRouter from "./routes/historyRoutes";

/**
 * Express App configuration.
 * Middleware setup (CORS, JSON parsing) and base routes.
 */
const app = express();

app.use(
  cors({
    exposedHeaders: ["X-Has-Warnings", "Content-Disposition"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api", slaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRouter);
app.use("/api/history", historyRouter);

export default app;
