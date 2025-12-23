'use client';

import { Service } from '@/types/service.types';
import { FiCheckCircle } from 'react-icons/fi';

interface ServiceDetailsProps {
  service: Service;
}

export default function ServiceDetails({ service }: ServiceDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Service Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {service.category}
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            service.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-700 leading-relaxed">{service.description}</p>
      </div>

      {/* Price */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-600">₹{service.price}</span>
          <span className="text-gray-600">Service Fee</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">One-time payment. No hidden charges.</p>
      </div>

      {/* Required Documents */}
      {service.requiredDocuments && service.requiredDocuments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Required Documents</h2>
          <ul className="space-y-2">
            {service.requiredDocuments.map((doc, index) => (
              <li key={index} className="flex items-start gap-3">
                <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                <span className="text-gray-700">{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">📝 Important Information</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Processing time: 3-5 business days</li>
          <li>• All documents must be clear and readable</li>
          <li>• Service fee is non-refundable once processing begins</li>
          <li>• You will be notified via email about status updates</li>
        </ul>
      </div>
    </div>
  );
}
