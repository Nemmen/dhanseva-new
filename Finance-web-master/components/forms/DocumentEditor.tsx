'use client';

import { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'sonner';
import {
  Eye,
  Download,
  RefreshCw,
  X,
  FileText,
  Loader2,
  Upload,
  Check,
  AlertCircle,
} from 'lucide-react';

interface DocumentEditorProps {
  label: string;
  currentUrl?: string;
  onUpdate: (newUrl: string) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export default function DocumentEditor({
  label,
  currentUrl,
  onUpdate,
  onDelete,
  disabled = false,
}: DocumentEditorProps) {
  const [isReplacing, setIsReplacing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing('fileReplacement', {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        onUpdate(res[0].url);
        toast.success(`${label} updated successfully!`);
        setIsReplacing(false);
      }
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadError: (error) => {
      setError(error.message || 'Upload failed');
      toast.error(error.message || 'Failed to upload file');
      setIsUploading(false);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      toast.error('File size must be less than 4MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await startUpload([file]);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setIsUploading(false);
    }
  };

  const isImage = currentUrl && 
    (currentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) || 
     currentUrl.includes('image'));

  // No document uploaded
  if (!currentUrl) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{label}</p>
              <p className="text-sm text-gray-500">No document uploaded</p>
            </div>
          </div>
          
          {!disabled && (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload
                  </>
                )}
              </span>
            </label>
          )}
        </div>

        {isUploading && (
          <div className="mt-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Document is uploaded - show preview with edit options
  return (
    <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="flex-shrink-0">
          {isImage ? (
            <img
              src={currentUrl}
              alt={label}
              className="w-16 h-16 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{label}</p>
          <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
            <Check className="w-4 h-4" />
            <span>Document uploaded</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </a>
            <a
              href={currentUrl}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </a>

            {!disabled && (
              <>
                {isReplacing ? (
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                      />
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {uploadProgress}%
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Select File
                          </>
                        )}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsReplacing(false)}
                      className="p-1.5 text-gray-500 hover:text-gray-700"
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsReplacing(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 text-sm rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Replace
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-3">
          <div className="h-2 bg-green-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
