import { createUploadthing, type FileRouter } from 'uploadthing/express';

// UploadThing automatically uses UPLOADTHING_SECRET from environment variables
const f = createUploadthing();

// UploadThing file router configuration
export const uploadRouter = {
  // Document upload for service requests (Aadhaar, PAN, etc.)
  documentUpload: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
    pdf: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Get user from request (set by auth middleware)
      const user = (req as any).user;
      
      if (!user) {
        throw new Error('Unauthorized - Please login to upload files');
      }

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
      const user = (req as any).user;
      
      if (!user) {
        throw new Error('Unauthorized - Please login to upload files');
      }

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
      const user = (req as any).user;
      
      if (!user) {
        throw new Error('Unauthorized');
      }

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
