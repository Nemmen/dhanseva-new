'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiFile, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'sonner';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  required?: boolean;
}

export default function FileUpload({
  label,
  accept = 'image/*,.pdf',
  maxSize = 10,
  value,
  onChange,
  error,
  required = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(
    value ? { name: 'Uploaded File', url: value } : null
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    try {
      setIsUploading(true);

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to your backend or UploadThing
      // For now, creating a temporary URL (replace with actual upload)
      const tempUrl = URL.createObjectURL(file);
      
      // TODO: Replace with actual upload to UploadThing
      // const response = await uploadToServer(formData);
      // const fileUrl = response.url;

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const fileData = {
        name: file.name,
        url: tempUrl, // Replace with actual URL from server
      };

      setUploadedFile(fileData);
      onChange(fileData.url);
      toast.success('File uploaded successfully');
    } catch (error) {
      //console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [maxSize, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, curr) => ({ ...acc, [curr.trim()]: [] }), {}),
    maxFiles: 1,
    multiple: false,
  });

  const handleRemove = () => {
    setUploadedFile(null);
    onChange('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {uploadedFile ? (
        // Uploaded File Preview
        <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600">File uploaded successfully</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      ) : (
        // Upload Dropzone
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          } ${error ? 'border-red-300 bg-red-50' : ''}`}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <FiLoader className="animate-spin text-blue-600" size={40} />
              <p className="text-gray-700 font-medium">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <FiUpload className="text-gray-400" size={40} />
              <div>
                <p className="text-gray-700 font-medium">
                  {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or <span className="text-blue-600 font-medium">browse</span> to choose a file
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Accepted: {accept} | Max size: {maxSize}MB
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
