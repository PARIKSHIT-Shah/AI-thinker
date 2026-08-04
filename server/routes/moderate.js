const express = require("express");
const router = express.Router();
const { runModerationPipeline } = require("../services/moderationPipeline");
const Interaction = require("../models/Interaction");

router.post("/moderate", async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || !input.trim()) {
      return res.status(400).json({ error: "input is required" });
    }
    if (input.length > 4000) {
      return res.status(400).json({ error: "input is too long (max 4000 characters)" });
    }

    const result = await runModerationPipeline(input.trim());

    const saved = await Interaction.create({
      input: input.trim(),
      status: result.status,
      blockedAtStage: result.blockedAtStage,
      reason: result.reason,
      categories: result.categories,
      output: result.output,
      stageTimings: result.stageTimings,
    });

    res.json({ id: saved._id, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
