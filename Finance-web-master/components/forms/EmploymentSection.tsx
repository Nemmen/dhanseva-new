'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ServiceFormData } from '@/types/request.types';

interface EmploymentSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function EmploymentSection({ register, errors }: EmploymentSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Employment Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employment Type */}
        <div>
          <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register('employmentType')}
            id="employmentType"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select employment type</option>
            {['Salaried', 'Self-Employed', 'Business Owner', 'Unemployed', 'Retired', 'Student'].map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.employmentType && (
            <p className="mt-1 text-sm text-red-600">{errors.employmentType.message as string}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            {...register('companyName')}
            type="text"
            id="companyName"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter company name (optional)"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName.message as string}</p>
          )}
        </div>

        {/* Monthly Income */}
        <div>
          <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Income <span className="text-red-500">*</span>
          </label>
          <input
            {...register('monthlyIncome', { valueAsNumber: true })}
            type="number"
            id="monthlyIncome"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter monthly income"
          />
          {errors.monthlyIncome && (
            <p className="mt-1 text-sm text-red-600">{errors.monthlyIncome.message as string}</p>
          )}
        </div>

        {/* Work Experience */}
        <div>
          <label htmlFor="workExperience" className="block text-sm font-medium text-gray-700 mb-1">
            Work Experience (Years)
          </label>
          <input
            {...register('workExperience', { valueAsNumber: true })}
            type="number"
            id="workExperience"
            min="0"
            step="0.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Years of experience (optional)"
          />
          {errors.workExperience && (
            <p className="mt-1 text-sm text-red-600">{errors.workExperience.message as string}</p>
          )}
        </div>
      </div>
    </div>
  );
}
