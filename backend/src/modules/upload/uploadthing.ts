import { createUploadthing, type FileRouter } from 'uploadthing/express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { prisma } from '../../config/database';

// UploadThing automatically uses UPLOADTHING_SECRET from environment variables
const f = createUploadthing();

// Helper function to verify JWT and get user from Authorization header
const verifyAuthToken = async (req: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw new Error('Unauthorized - No authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Unauthorized - No token provided');
  }

  try {
    // Verify JWT using the same secret as Express authenticate
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      role: string;
    };

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, emailVerified: true },
    });

    if (!user) {
      throw new Error('Unauthorized - User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    };
  } catch (error) {
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
