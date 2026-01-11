import { Router, Request, Response, NextFunction } from 'express';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './uploadthing';
import { authenticate } from '../../middleware/auth';
import { UTApi } from 'uploadthing/server';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();
const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_SECRET,
});

// Create the UploadThing route handler
const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
});

// UploadThing routes - Handle auth inside the route to set req.user for UploadThing
// Authentication is checked inside uploadRouter's .middleware() functions
// This allows UploadThing to properly handle OPTIONS, GET, and POST requests
router.use('/uploadthing', (req: Request, res: Response, next: NextFunction) => {
  // Apply authentication to set req.user, but don't block the request
  // Let UploadThing's own middleware decide if the request should proceed
  authenticate(req, res, () => {
    // Even if auth fails, continue to UploadThing handler
    // The uploadRouter middleware will handle unauthorized cases
    uploadthingHandler(req, res, next);
  });
});

// Delete file endpoint
router.delete('/files/:fileKey', authenticate, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { fileKey } = req.params;
  
  if (!fileKey) {
    res.status(400).json({ success: false, message: 'File key is required' });
    return;
  }

  try {
    await utapi.deleteFiles(fileKey);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ success: false, message: 'Failed to delete file' });
  }
}));

// Get file info endpoint
router.get('/files/:fileKey/info', authenticate, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { fileKey } = req.params;
  
  if (!fileKey) {
    res.status(400).json({ success: false, message: 'File key is required' });
    return;
  }

  try {
    const fileUrls = await utapi.getFileUrls(fileKey);
    if (fileUrls.data && fileUrls.data.length > 0) {
      res.json({ success: true, data: fileUrls.data[0] });
    } else {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(500).json({ success: false, message: 'Failed to get file info' });
  }
}));

export default router;
