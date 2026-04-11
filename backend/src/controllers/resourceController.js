const { z } = require("zod");
const { Resource, RESOURCE_TYPES } = require("../models/Resource");
const { supabase } = require("../config/supabase");

const BUCKET = process.env.SUPABASE_BUCKET || "resources";
// Signed URL expiry: 1 hour
const SIGNED_URL_EXPIRY = 60 * 60;

const uploadSchema = z.object({
  title: z.string().min(1).max(200),
  subject: z.string().min(1).max(80),
  semester: z.coerce.number().int().min(1).max(12),
  type: z.enum(RESOURCE_TYPES),
});

async function uploadResource(req, res) {
  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ error: "Invalid input", details: parsed.error.flatten() });
  if (!req.file) return res.status(400).json({ error: "File is required" });

  // Build a unique S3-style key inside the bucket
  const ext = req.file.originalname.includes(".")
    ? "." + req.file.originalname.split(".").pop()
    : "";
  const storageKey = `uploads/${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}${ext}`;

  // Upload buffer to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storageKey, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    return res.status(500).json({ error: "File upload to storage failed" });
  }

  const created = await Resource.create({
    ...parsed.data,
    filePath: storageKey,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploader: req.user.id,
  });

  return res.status(201).json({ resource: created });
}

async function listResources(req, res) {
  const subject = req.query.subject?.toString();
  const type = req.query.type?.toString();
  const semester = req.query.semester ? Number(req.query.semester) : undefined;

  const filter = {};
  if (subject) filter.subject = new RegExp(subject, "i");
  if (type) filter.type = type;
  if (Number.isFinite(semester)) filter.semester = semester;

  const resources = await Resource.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .select("-voteByUser");

  return res.json({ resources });
}

async function searchResources(req, res) {
  const q = (req.query.q || "").toString().trim();
  if (!q) return res.json({ resources: [] });

  const resources = await Resource.find({ $text: { $search: q } })
    .sort({ score: { $meta: "textScore" }, createdAt: -1 })
    .limit(50)
    .select("-voteByUser");

  return res.json({ resources });
}

async function getResource(req, res) {
  const resource = await Resource.findById(req.params.id).select("-voteByUser");
  if (!resource) return res.status(404).json({ error: "Not found" });
  return res.json({ resource });
}

async function getSignedUrl(filePath) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRY);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

async function downloadResource(req, res) {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ error: "Not found" });

  const signedUrl = await getSignedUrl(resource.filePath);
  if (!signedUrl)
    return res.status(500).json({ error: "Could not generate download link" });

  // Tell browser to treat it as an attachment (force download)
  res.redirect(
    `${signedUrl}&response-content-disposition=attachment%3B+filename%3D"${encodeURIComponent(
      resource.originalName
    )}"`
  );
}

async function viewResource(req, res) {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ error: "Not found" });

  const signedUrl = await getSignedUrl(resource.filePath);
  if (!signedUrl)
    return res.status(500).json({ error: "Could not generate view link" });

  res.redirect(signedUrl);
}

const voteSchema = z.object({ direction: z.enum(["up", "down"]) });

async function voteResource(req, res) {
  const parsed = voteSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ error: "Invalid input", details: parsed.error.flatten() });

  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ error: "Not found" });

  const userId = req.user.id;
  const prev = resource.voteByUser?.get(userId) || null;
  const next = parsed.data.direction;

  if (prev === next) {
    return res.json({
      resource: {
        id: resource._id.toString(),
        upvotes: resource.upvotes,
        downvotes: resource.downvotes,
      },
    });
  }

  if (prev === "up") resource.upvotes = Math.max(0, resource.upvotes - 1);
  if (prev === "down") resource.downvotes = Math.max(0, resource.downvotes - 1);
  if (next === "up") resource.upvotes += 1;
  if (next === "down") resource.downvotes += 1;
  resource.voteByUser.set(userId, next);

  await resource.save();
  return res.json({
    resource: {
      id: resource._id.toString(),
      upvotes: resource.upvotes,
      downvotes: resource.downvotes,
    },
  });
}

module.exports = {
  uploadResource,
  listResources,
  searchResources,
  getResource,
  downloadResource,
  viewResource,
  voteResource,
};
