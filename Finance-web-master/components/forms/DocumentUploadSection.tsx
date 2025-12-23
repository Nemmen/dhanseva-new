'use client';

import { Control, Controller } from 'react-hook-form';
import { ServiceFormData } from '@/types/request.types';
import FileUpload from './FileUpload';

interface DocumentUploadSectionProps {
  control: Control<any>;
}

export default function DocumentUploadSection({ control }: DocumentUploadSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>

      <div className="space-y-6">
        {/* Aadhaar Card */}
        <Controller
          name="aadhaarCard"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FileUpload
              label="Aadhaar Card"
              accept="image/*,.pdf"
              maxSize={10}
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
              required
            />
          )}
        />

        {/* PAN Card */}
        <Controller
          name="panCard"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FileUpload
              label="PAN Card"
              accept="image/*,.pdf"
              maxSize={10}
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
              required
            />
          )}
        />

        {/* Income Proof (Optional) */}
        <Controller
          name="incomeProof"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FileUpload
              label="Income Proof (Salary Slip / Bank Statement)"
              accept="image/*,.pdf"
              maxSize={10}
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
              required={false}
            />
          )}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📄 Document Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Documents should be clear and readable</li>
          <li>• Accepted formats: JPG, PNG, PDF</li>
          <li>• Maximum file size: 10MB per document</li>
          <li>• Ensure all corners of the document are visible</li>
          <li>• Do not upload blurred or edited documents</li>
        </ul>
      </div>
    </div>
  );
}
