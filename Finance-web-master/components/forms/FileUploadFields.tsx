'use client';

import { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { DOCUMENT_FIELDS, FormField } from '@/config/serviceForms';
import { Upload, X, FileText, Check } from 'lucide-react';

interface FileUploadFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  setValue: UseFormSetValue<any>;
}

export default function FileUploadFields({ 
  register, 
  errors,
  setValue 
}: FileUploadFieldsProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const handleFileChange = (fieldName: string, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [fieldName]: file }));
    setValue(fieldName, file);

    // Generate preview for images
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({ ...prev, [fieldName]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[fieldName];
        return newPreviews;
      });
    }
  };

  const removeFile = (fieldName: string) => {
    handleFileChange(fieldName, null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
        Document Upload
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Upload clear images or PDFs of your documents. Maximum file size: 5MB per file.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOCUMENT_FIELDS.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {uploadedFiles[field.name] ? (
              // File uploaded state
              <div className="relative border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {previews[field.name] ? (
                    <img 
                      src={previews[field.name]} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-green-100 rounded flex items-center justify-center">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadedFiles[field.name]?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFiles[field.name]?.size || 0 / 1024).toFixed(1)} KB
                    </p>
                    <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                      <Check className="w-3 h-3" />
                      <span>Uploaded</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(field.name)}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    title="Remove file"
                    aria-label="Remove file"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              // Upload state
              <label className="cursor-pointer block">
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50 ${
                  errors[field.name] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}>
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${
                    errors[field.name] ? 'text-red-400' : 'text-gray-400'
                  }`} />
                  <p className="text-sm text-gray-600">
                    Click to upload {field.label.toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, PDF (max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file && file.size > 5 * 1024 * 1024) {
                      alert('File size must be less than 5MB');
                      return;
                    }
                    handleFileChange(field.name, file);
                  }}
                />
              </label>
            )}
            
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]?.message as string}</p>
            )}
          </div>
        ))}
      </div>

      {/* Additional Documents */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Additional documents may be requested based on your service requirements. 
          Our team will contact you if more documents are needed.
        </p>
      </div>
    </div>
  );
}
