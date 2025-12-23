'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BASE_FORM_FIELDS, FormField } from '@/config/serviceForms';

interface BaseFormFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function BaseFormFields({ register, errors }: BaseFormFieldsProps) {
  const renderField = (field: FormField) => {
    const error = errors[field.name];
    const errorMessage = error?.message as string;

    const baseInputClasses = `w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base ${
      error ? 'border-red-500 bg-red-50' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'select':
        return (
          <select
            {...register(field.name, { required: field.required && `${field.label} is required` })}
            className={baseInputClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            {...register(field.name, { required: field.required && `${field.label} is required` })}
            placeholder={field.placeholder}
            className={`${baseInputClasses} min-h-[100px] resize-y`}
            rows={3}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            {...register(field.name, { 
              required: field.required && `${field.label} is required`,
              valueAsNumber: true 
            })}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );

      default:
        return (
          <input
            type={field.type}
            {...register(field.name, { required: field.required && `${field.label} is required` })}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  // Group fields for better layout
  const personalFields = BASE_FORM_FIELDS.slice(0, 5); // firstName to whatsapp
  const employmentFields = BASE_FORM_FIELDS.slice(5, 10); // employment to accountHolderName
  const addressFields = BASE_FORM_FIELDS.slice(10); // address to pincode

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 pb-2 border-b">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {personalFields.map((field) => (
            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.name]?.message as string}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Employment & Financial Information */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 pb-2 border-b">
          Employment & Financial Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {employmentFields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.name]?.message as string}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 pb-2 border-b">
          Address Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {addressFields.map((field) => (
            <div key={field.name} className={field.name === 'address' ? 'md:col-span-2' : ''}>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.name]?.message as string}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
