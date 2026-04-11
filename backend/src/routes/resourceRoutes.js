const express = require("express");
const multer = require("multer");
const { requireAuth } = require("../middleware/requireAuth");
const {
  uploadResource,
  listResources,
  searchResources,
  getResource,
  downloadResource,
  viewResource,
  voteResource,
} = require("../controllers/resourceController");

// Use memory storage — file buffer is uploaded directly to Supabase Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

const router = express.Router();

router.get("/", listResources);
router.get("/search", searchResources);
router.get("/:id", getResource);
router.get("/:id/download", downloadResource);
router.get("/:id/view", viewResource);

router.post("/", requireAuth, upload.single("file"), uploadResource);
router.post("/:id/vote", requireAuth, voteResource);

module.exports = { resourceRoutes: router };
