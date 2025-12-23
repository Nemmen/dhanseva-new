'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField, ServiceFormConfig } from '@/config/serviceForms';

interface ServiceSpecificFieldsProps {
  config: ServiceFormConfig;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function ServiceSpecificFields({ 
  config, 
  register, 
  errors 
}: ServiceSpecificFieldsProps) {
  if (!config.extraFields || config.extraFields.length === 0) {
    return null;
  }

  const renderField = (field: FormField) => {
    const error = errors[field.name];

    const baseInputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
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

      case 'date':
        return (
          <input
            type="date"
            {...register(field.name, { required: field.required && `${field.label} is required` })}
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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
        {config.serviceName} - Specific Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.extraFields.map((field) => (
          <div 
            key={field.name} 
            className={field.type === 'textarea' ? 'md:col-span-2' : ''}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name]?.message as string}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
