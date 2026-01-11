import { Router } from "express";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing";
import { UTApi } from "uploadthing/server";

const router = Router();
const utapi = new UTApi();

// v6 LEGACY keys
const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
  config: {
    uploadthingSecret: process.env.UPLOADTHING_SECRET!,
    uploadthingId: process.env.UPLOADTHING_ID!,
  },
});

// ⚠️ DO NOT WRAP THIS WITH AUTH
router.use("/uploadthing", uploadthingHandler);

// File delete
router.delete("/files/:fileKey", async (req, res) => {
  try {
    await utapi.deleteFiles(req.params.fileKey);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// File info
router.get("/files/:fileKey/info", async (req, res) => {
  try {
    const files = await utapi.getFileUrls([req.params.fileKey]);
    res.json(files.data[0]);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
