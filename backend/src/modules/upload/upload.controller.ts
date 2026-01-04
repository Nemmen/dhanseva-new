import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

/**
 * Delete a file from UploadThing
 */
export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { fileKey } = req.params;

  if (!fileKey) {
    throw new AppError('File key is required', 400);
  }

  // Only allow DSA, EMPLOYEE, or the file owner to delete
  if (!['DSA', 'EMPLOYEE'].includes(user.role)) {
    throw new AppError('Unauthorized to delete this file', 403);
  }

  try {
    await utapi.deleteFiles(fileKey);
    return sendSuccess(res, { deleted: true, fileKey }, 'File deleted successfully');
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw new AppError('Failed to delete file', 500);
  }
});

/**
 * Get file info from UploadThing
 */
export const getFileInfo = asyncHandler(async (req: Request, res: Response) => {
  const { fileKey } = req.params;

  if (!fileKey) {
    throw new AppError('File key is required', 400);
  }

  try {
    const files = await utapi.getFileUrls([fileKey]);
    
    if (!files.data || files.data.length === 0) {
      throw new AppError('File not found', 404);
    }

    return sendSuccess(res, files.data[0], 'File info retrieved successfully');
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('Error getting file info:', error);
    throw new AppError('Failed to get file info', 500);
  }
});

/**
 * Service class for file operations
 */
export class UploadService {
  /**
   * Delete multiple files
   */
  static async deleteFiles(fileKeys: string[]): Promise<void> {
    if (fileKeys.length === 0) return;
    
    try {
      await utapi.deleteFiles(fileKeys);
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  }

  /**
   * Get URLs for multiple files
   */
  static async getFileUrls(fileKeys: string[]): Promise<{ key: string; url: string }[]> {
    if (fileKeys.length === 0) return [];
    
    try {
      const result = await utapi.getFileUrls(fileKeys);
      // Convert readonly array to mutable
      return [...result.data];
    } catch (error) {
      console.error('Error getting file URLs:', error);
      return [];
    }
  }

  /**
   * Extract file key from UploadThing URL
   */
  static extractFileKey(url: string): string | null {
    if (!url) return null;
    
    // UploadThing URLs are like: https://utfs.io/f/{fileKey}
    const match = url.match(/\/f\/([^/?]+)/);
    return match ? match[1] : null;
  }
}
