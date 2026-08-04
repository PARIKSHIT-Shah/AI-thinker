require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// The API is meant to defend itself, so basic rate limiting is part of
// that story too - caps abuse of the /moderate endpoint specifically.
const moderateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Too many requests. Please wait a moment and try again." },
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully buddy!"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api", moderateLimiter, require("./routes/moderate"));
app.use("/api", require("./routes/logs"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
