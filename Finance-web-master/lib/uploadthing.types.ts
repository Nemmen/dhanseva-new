// UploadThing file router types
// This should ideally be imported from backend, but for now we declare it
export type OurFileRouter = {
  documentUpload: any;
  multiDocumentUpload: any;
  fileReplacement: any;
};

// Upload response type
export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  key: string;
}

// Document field types
export type DocumentFieldName = 
  | 'aadhaarFrontUrl'
  | 'aadhaarBackUrl'
  | 'panFrontUrl'
  | 'panBackUrl';

export interface DocumentUploadState {
  [key: string]: {
    url: string;
    name: string;
    isUploading: boolean;
    error?: string;
  } | null;
}
