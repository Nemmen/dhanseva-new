import { createUploadthing, type FileRouter } from 'uploadthing/express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { prisma } from '../../config/database';

// UploadThing automatically uses UPLOADTHING_SECRET from environment variables
const f = createUploadthing();

// Helper function to verify JWT and get user from Authorization header or cookies
const verifyAuthToken = async (req: any) => {
  try {
    // Check for token in cookies (dhanseva_token) or Authorization header (like Express authenticate does)
    const token = req.cookies?.['dhanseva_token'] || req.headers?.authorization?.replace('Bearer ', '');
    
    if (!token) {
      console.error('[UploadThing Auth] No token found in cookies or Authorization header');
      throw new Error('Unauthorized - No token provided');
    }

    console.log('[UploadThing Auth] Token found, verifying...');

    // Verify JWT using the same secret as Express authenticate
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      role: string;
    };

    console.log('[UploadThing Auth] JWT verified for user:', decoded.id);

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, emailVerified: true },
    });

    if (!user) {
      console.error('[UploadThing Auth] User not found in database:', decoded.id);
      throw new Error('Unauthorized - User not found');
    }

    console.log('[UploadThing Auth] User authenticated:', user.id, user.role);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    };
  } catch (error) {
    console.error('[UploadThing Auth] Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Unauthorized - Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Unauthorized - Token expired');
    }
    throw error;
  }
};

// UploadThing file router configuration
export const uploadRouter = {
  // Document upload for service requests (Aadhaar, PAN, etc.)
  documentUpload: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
    pdf: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Verify JWT directly from Authorization header
      const user = await verifyAuthToken(req);

      // Return metadata to be stored with the file
      return { 
        userId: user.id,
        userRole: user.role,
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for user:', metadata.userId);
      console.log('File URL:', file.url);
      
      return { 
        url: file.url,
        name: file.name,
        size: file.size,
        key: file.key,
        uploadedBy: metadata.userId,
      };
    }),

  // Multiple document upload
  multiDocumentUpload: f({
    image: { maxFileSize: '4MB', maxFileCount: 10 },
    pdf: { maxFileSize: '4MB', maxFileCount: 10 },
  })
    .middleware(async ({ req }) => {
      // Verify JWT directly from Authorization header
      const user = await verifyAuthToken(req);

      return { 
        userId: user.id,
        userRole: user.role,
      };
    })
    .onUploadComplete(async ({ metadata: _metadata, file }) => {
      return { 
        url: file.url,
        name: file.name,
        size: file.size,
        key: file.key,
      };
    }),

  // DSA/Employee file replacement upload
  fileReplacement: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
    pdf: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Verify JWT directly from Authorization header
      const user = await verifyAuthToken(req);

      // Only DSA and EMPLOYEE can replace files
      if (!['DSA', 'EMPLOYEE'].includes(user.role)) {
        throw new Error('Only DSA or Employee can replace files');
      }

      return { 
        userId: user.id,
        userRole: user.role,
        replacedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('File replaced by:', metadata.userRole, metadata.userId);
      
      return { 
        url: file.url,
        name: file.name,
        size: file.size,
        key: file.key,
        replacedBy: metadata.userId,
        replacedAt: metadata.replacedAt,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
