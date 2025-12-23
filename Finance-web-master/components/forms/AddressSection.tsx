'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ServiceFormData } from '@/types/request.types';
import { indianStates } from '@/schemas/serviceSchemas';

interface AddressSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function AddressSection({ register, errors }: AddressSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Address Details</h3>

      <div className="grid grid-cols-1 gap-4">
        {/* Address Line 1 */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('address')}
            type="text"
            id="address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="House no., Building name, Street"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message as string}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              {...register('city')}
              type="text"
              id="city"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your city"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message as string}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              {...register('state')}
              id="state"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select state</option>
              {indianStates.map((state: string) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state.message as string}</p>
            )}
          </div>

          {/* PIN Code */}
          <div>
            <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">
              PIN Code <span className="text-red-500">*</span>
            </label>
            <input
              {...register('pinCode')}
              type="text"
              id="pinCode"
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="6-digit PIN code"
            />
            {errors.pinCode && (
              <p className="mt-1 text-sm text-red-600">{errors.pinCode.message as string}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
