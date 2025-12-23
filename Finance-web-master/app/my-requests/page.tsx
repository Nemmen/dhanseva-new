'use client';

import { useState, useMemo } from 'react';
import { useMyRequests } from '@/hooks/useRequests';
import { useRequireAuth } from '@/hooks/useAuthGuard';
import MainLayout from '@/components/layout/MainLayout';
import RequestList from '@/components/requests/RequestList';
import RequestFilters from '@/components/requests/RequestFilters';

export default function MyRequestsPage() {
  useRequireAuth(); // Protect route
  
  const { data: requests, isLoading } = useMyRequests();
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');

  // Filter requests
  const filteredRequests = useMemo(() => {
    // Handle the API response structure: { success, message, data: { requests, pagination } }
    // The response could be in various shapes depending on axios interceptor
    const rawData = requests as any;
    const requestsList = rawData?.data?.requests || rawData?.requests || rawData?.data || [];
    if (!Array.isArray(requestsList)) return [];

    let filtered = [...requestsList]; // Create a copy to avoid mutation

    // Filter by request status
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter((req: any) => req.status === selectedStatus);
    }

    // Filter by payment status
    if (selectedPaymentStatus !== 'ALL') {
      filtered = filtered.filter((req: any) => {
        if (selectedPaymentStatus === 'PAID') return req.paid === true;
        if (selectedPaymentStatus === 'UNPAID') return req.paid === false;
        return true;
      });
    }

    // Sort by created date (newest first)
    return filtered.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [requests, selectedStatus, selectedPaymentStatus]);

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 sm:py-12">
        <div className="container-custom px-4">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">My Service Requests</h1>
          <p className="text-base sm:text-xl text-blue-100">
            Track and manage all your service applications
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-6 sm:py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <RequestFilters
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedPaymentStatus={selectedPaymentStatus}
                onPaymentStatusChange={setSelectedPaymentStatus}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Results Count */}
            {!isLoading && (
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredRequests.length}</span> request
                  {filteredRequests.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Requests List */}
            <RequestList requests={filteredRequests} isLoading={isLoading} />
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
