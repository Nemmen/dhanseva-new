// UploadThing file router types (must match backend)
export type OurFileRouter = {
  documentUpload: {
    input: void;
    output: {
      url: string;
      name: string;
      size: number;
      key: string;
      uploadedBy: string;
    };
  };
  multiDocumentUpload: {
    input: void;
    output: {
      url: string;
      name: string;
      size: number;
      key: string;
    };
  };
  fileReplacement: {
    input: void;
    output: {
      url: string;
      name: string;
      size: number;
      key: string;
      replacedBy: string;
      replacedAt: string;
    };
  };
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
