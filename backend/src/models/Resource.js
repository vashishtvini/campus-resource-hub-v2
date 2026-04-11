const mongoose = require("mongoose");

const RESOURCE_TYPES = ["notes", "PYQ", "assignment"];

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    subject: { type: String, required: true, trim: true, maxlength: 80 },
    semester: { type: Number, required: true, min: 1, max: 12 },
    type: { type: String, required: true, enum: RESOURCE_TYPES },

    filePath: { type: String, required: true }, // Supabase storage object key
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },

    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voteByUser: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

resourceSchema.index({ title: "text", subject: "text" });
resourceSchema.index({ subject: 1, semester: 1, type: 1, createdAt: -1 });

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = { Resource, RESOURCE_TYPES };
