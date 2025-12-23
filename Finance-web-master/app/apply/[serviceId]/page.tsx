'use client';

import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useAuthGuard';
import { getServiceById } from '@/data/services';
import MainLayout from '@/components/layout/MainLayout';
import { DynamicServiceForm } from '@/components/forms';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ApplyPageProps {
  params: { serviceId: string };
}

export default function ApplyPage({ params }: ApplyPageProps) {
  const { user, loading } = useRequireAuth();
  const router = useRouter();
  
  // Get service from static data
  const service = getServiceById(params.serviceId);

  // Show loading while checking auth
  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Service not found
  if (!service) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
            <p className="text-gray-600 mb-6">
              The service you're looking for doesn't exist or may have been removed.
            </p>
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse All Services
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <div className="container-custom py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Apply for {service.name}
            </h1>
            <p className="text-gray-600">
              Complete the form below to submit your application
            </p>
          </div>

          {/* Dynamic Form */}
          <DynamicServiceForm service={service} />
        </div>
      </div>
    </MainLayout>
  );
}
