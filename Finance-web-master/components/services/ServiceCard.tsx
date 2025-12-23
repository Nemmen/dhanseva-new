'use client';

import Link from 'next/link';
import { Service } from '@/types/service.types';
import { FaArrowRight } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Map category to icon emoji
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      PERSONAL_LEGAL: '👤',
      BUSINESS_LEGAL: '💼',
      FINANCIAL_LEGAL: '🏦',
      GOVT_COMPLIANCE: '🏛️',
      SPECIALIZED_LEGAL: '⚖️',
    };
    return icons[category] || '📄';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200 p-6 group">
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
          <span className="text-3xl">{getCategoryIcon(service.category)}</span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {service.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {service.description || 'Professional legal service'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(service.price)}
            </span>
          </div>
          <Link
            href={`/services/${service.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            Apply Now
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
