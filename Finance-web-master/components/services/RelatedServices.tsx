'use client';

import { Service } from '@/types/service.types';
import ServiceCard from '@/components/services/ServiceCard';

interface RelatedServicesProps {
  services: Service[];
  currentServiceId: string;
}

export default function RelatedServices({ services, currentServiceId }: RelatedServicesProps) {
  // Filter out current service and show max 3
  const relatedServices = services
    .filter((service) => service.id !== currentServiceId && service.isActive)
    .slice(0, 3);

  if (relatedServices.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
