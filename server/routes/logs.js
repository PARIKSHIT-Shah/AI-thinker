const express = require("express");
const router = express.Router();
const Interaction = require("../models/Interaction");

router.get("/logs", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 25, 100);
    const logs = await Interaction.find().sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/logs/stats", async (req, res) => {
  try {
    const [total, blocked, safe] = await Promise.all([
      Interaction.countDocuments(),
      Interaction.countDocuments({ status: "blocked" }),
      Interaction.countDocuments({ status: "safe" }),
    ]);
    res.json({ total, blocked, safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
