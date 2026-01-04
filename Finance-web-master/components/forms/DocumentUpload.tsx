'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { 
  Upload, 
  X, 
  FileText, 
  Check, 
  Loader2, 
  Eye, 
  Download,
  RefreshCw,
  AlertCircle 
} from 'lucide-react';

interface DocumentUploadProps {
  label: string;
  fieldName: string;
  accept?: string;
  maxSize?: number; // in MB
  value?: string; // URL of existing file
  onChange: (url: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  allowReplace?: boolean; // For DSA/Employee file replacement
  endpoint?: 'documentUpload' | 'fileReplacement';
}

export default function DocumentUpload({
  label,
  fieldName,
  accept = 'image/*,.pdf',
  maxSize = 4,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  allowReplace = false,
  endpoint = 'documentUpload',
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [fileName, setFileName] = useState<string | null>(null);

  // UploadThing hook
  const { startUpload, isUploading: utIsUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res: { url: string; name: string }[]) => {
      if (res && res.length > 0) {
        const uploadedFile = res[0];
        setPreviewUrl(uploadedFile.url);
        setFileName(uploadedFile.name);
        onChange(uploadedFile.url);
        setUploadError(null);
        toast.success('File uploaded successfully!');
      }
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadError: (error: Error) => {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed');
      toast.error(error.message || 'Failed to upload file');
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (progress: number) => {
      setUploadProgress(progress);
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setFileName(file.name);

    // Create local preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Start upload to UploadThing
    try {
      await startUpload([file]);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
      setIsUploading(false);
    }
  }, [maxSize, startUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
    disabled: disabled || isUploading,
  });

  const handleRemove = () => {
    setPreviewUrl(null);
    setFileName(null);
    setUploadError(null);
    onChange('');
  };

  const isImage = previewUrl && !previewUrl.endsWith('.pdf') && 
    (previewUrl.startsWith('data:image') || previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i));

  // Uploaded file preview
  if (previewUrl && !isUploading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-start gap-4">
            {/* Preview */}
            <div className="flex-shrink-0">
              {isImage ? (
                <img
                  src={previewUrl}
                  alt={label}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>

            {/* Info and Actions */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fileName || 'Uploaded Document'}
              </p>
              <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                <Check className="w-3 h-3" />
                <span>Uploaded successfully</span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-3">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  View
                </a>
                <a
                  href={previewUrl}
                  download
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Download
                </a>
                {(allowReplace || !disabled) && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Replace
                  </button>
                )}
              </div>
            </div>

            {/* Remove button */}
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Upload dropzone
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${error || uploadError ? 'border-red-300 bg-red-50' : ''}
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <div className="w-full max-w-xs">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className={`w-10 h-10 ${error || uploadError ? 'text-red-400' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm text-gray-700 font-medium">
                {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or <span className="text-blue-600 font-medium">browse</span> to choose
              </p>
            </div>
            <p className="text-xs text-gray-400">
              JPG, PNG, PDF (max {maxSize}MB)
            </p>
          </div>
        )}
      </div>

      {/* Error messages */}
      {(error || uploadError) && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error || uploadError}</span>
        </div>
      )}
    </div>
  );
}
