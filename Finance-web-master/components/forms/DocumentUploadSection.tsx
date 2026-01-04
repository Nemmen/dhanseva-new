'use client';

import { Control, Controller } from 'react-hook-form';
import DocumentUpload from './DocumentUpload';

interface DocumentUploadSectionProps {
  control: Control<any>;
  isEditing?: boolean; // For DSA/Employee file replacement
}

export default function DocumentUploadSection({ 
  control, 
  isEditing = false 
}: DocumentUploadSectionProps) {
  const endpoint = isEditing ? 'fileReplacement' : 'documentUpload';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
      <p className="text-sm text-gray-600">
        Upload clear images or PDFs of your documents. Maximum file size: 4MB per file.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aadhaar Front */}
        <Controller
          name="aadhaarFrontUrl"
          control={control}
          rules={{ required: 'Aadhaar front is required' }}
          render={({ field, fieldState: { error } }) => (
            <DocumentUpload
              label="Aadhaar Card (Front)"
              fieldName="aadhaarFrontUrl"
              accept="image/*,.pdf"
              maxSize={4}
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
              required
              endpoint={endpoint}
              allowReplace={isEditing}
            />
          )}
        />

        {/* Aadhaar Back */}
        <Controller
          name="aadhaarBackUrl"
          control={control}
          rules={{ required: 'Aadhaar back is required' }}
          render={({ field, fieldState: { error } }) => (
            <DocumentUpload
              label="Aadhaar Card (Back)"
              fieldName="aadhaarBackUrl"
              accept="image/*,.pdf"
              maxSize={4}
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
              required
              endpoint={endpoint}
              allowReplace={isEditing}
            />
          )}
        />

        {/* PAN Front */}
        <Controller
          name="panFrontUrl"
          control={control}
          rules={{ required: 'PAN card is required' }}
          render={({ field, fieldState: { error } }) => (
            <DocumentUpload
              label="PAN Card (Front)"
              fieldName="panFrontUrl"
              accept="image/*,.pdf"
              maxSize={4}
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
              required
              endpoint={endpoint}
              allowReplace={isEditing}
            />
          )}
        />

        {/* PAN Back (Optional) */}
        <Controller
          name="panBackUrl"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DocumentUpload
              label="PAN Card (Back) - Optional"
              fieldName="panBackUrl"
              accept="image/*,.pdf"
              maxSize={4}
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
              required={false}
              endpoint={endpoint}
              allowReplace={isEditing}
            />
          )}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📄 Document Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Documents should be clear and readable</li>
          <li>• Accepted formats: JPG, PNG, PDF</li>
          <li>• Maximum file size: 4MB per document</li>
          <li>• Ensure all corners of the document are visible</li>
          <li>• Do not upload blurred or edited documents</li>
        </ul>
      </div>
    </div>
  );
}
