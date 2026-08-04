const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    status: { type: String, enum: ["safe", "blocked"], required: true },
    blockedAtStage: { type: String, default: null }, // "safety" | "policy" | null
    reason: { type: String, default: null },
    categories: { type: [String], default: [] },
    output: { type: String, default: null }, // final generated response, if safe
    stageTimings: {
      safetyMs: Number,
      policyMs: Number,
      generationMs: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interaction", interactionSchema);
