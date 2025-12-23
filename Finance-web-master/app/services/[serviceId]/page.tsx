'use client';

import { useRouter } from 'next/navigation';
import { SERVICES } from '@/data/services';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { FaArrowLeft, FaCheckCircle, FaClock, FaFileAlt, FaArrowRight } from 'react-icons/fa';
import { toast } from 'sonner';
import Link from 'next/link';

interface ServiceDetailPageProps {
  params: { serviceId: string };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const service = SERVICES.find(s => s.id === params.serviceId);

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for this service');
      router.push(`/login?redirect=/apply/${params.serviceId}`);
      return;
    }

    router.push(`/apply/${params.serviceId}`);
  };

  if (!service) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
            <p className="text-gray-600 mb-6">
              The service you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <FaArrowLeft />
              Back to Services
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const relatedServices = SERVICES.filter(
    (s) => s.category === service.category && s.id !== service.id
  ).slice(0, 3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-5xl">{service.icon}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.name}</h1>
            <p className="text-xl text-white/90 mb-6">{service.description}</p>
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">₹{service.price}/-</div>
                <div className="text-sm text-white/80">Processing Fee</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg flex items-center gap-2">
                <FaClock />
                <div>
                  <div className="font-semibold">{service.deliveryTime}</div>
                  <div className="text-sm text-white/80">Delivery Time</div>
                </div>
              </div>
            </div>
            <button 
              onClick={handleApply}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Apply Now
              <FaArrowRight />
            </button>
            {!isAuthenticated && (
              <p className="text-sm text-white/80 mt-4">
                Please{' '}
                <Link href="/login" className="underline hover:text-white">
                  login
                </Link>{' '}
                to apply for this service
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Requirements */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FaFileAlt className="text-primary-600 text-3xl" />
                <h2 className="text-2xl font-bold text-gray-900">Documents Required</h2>
              </div>
              <ul className="space-y-3">
                {service.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FaCheckCircle className="text-green-600 text-3xl" />
                <h2 className="text-2xl font-bold text-gray-900">Key Benefits</h2>
              </div>
              <ul className="space-y-3">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-primary-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="space-y-6">
            {service.processSteps.map((step, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-700">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-white border-t">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Related Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.id}
                  href={`/services/${relatedService.id}`}
                  className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-500 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                      <span className="text-3xl">{relatedService.icon}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedService.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {relatedService.description.slice(0, 60)}...
                    </p>
                    <span className="text-primary-600 font-bold">₹{relatedService.price}/-</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Apply?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get your {service.name.toLowerCase()} in just {service.deliveryTime.toLowerCase()}
          </p>
          <button 
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Application
            <FaArrowRight />
          </button>
        </div>
      </section>
    </MainLayout>
  );
}
