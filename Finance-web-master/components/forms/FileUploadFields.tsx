'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue, Control, Controller } from 'react-hook-form';
import DocumentUpload from './DocumentUpload';

interface FileUploadFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  setValue: UseFormSetValue<any>;
  control?: Control<any>;
  isEditing?: boolean;
}

const DOCUMENT_FIELDS = [
  { name: 'aadhaarFrontUrl', label: 'Aadhaar Card (Front)', required: true },
  { name: 'aadhaarBackUrl', label: 'Aadhaar Card (Back)', required: true },
  { name: 'panFrontUrl', label: 'PAN Card (Front)', required: true },
  { name: 'panBackUrl', label: 'PAN Card (Back)', required: false },
];

export default function FileUploadFields({ 
  register, 
  errors,
  setValue,
  control,
  isEditing = false,
}: FileUploadFieldsProps) {
  const endpoint = isEditing ? 'fileReplacement' : 'documentUpload';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
        Document Upload
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Upload clear images or PDFs of your documents. Maximum file size: 4MB per file.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOCUMENT_FIELDS.map((field) => (
          <DocumentUpload
            key={field.name}
            label={field.label}
            fieldName={field.name}
            accept="image/*,.pdf"
            maxSize={4}
            onChange={(url) => setValue(field.name, url, { shouldValidate: true })}
            error={errors[field.name]?.message as string}
            required={field.required}
            endpoint={endpoint}
            allowReplace={isEditing}
          />
        ))}
      </div>

      {/* Additional Documents Note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Additional documents may be requested based on your service requirements. 
          Our team will contact you if more documents are needed.
        </p>
      </div>
    </div>
  );
}
