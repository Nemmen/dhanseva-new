'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dsaService } from '@/services/dsaService';
import { DsaRequest, DsaFilters, RequestStatus } from '@/types/dsa.types';
import { 
  FiSearch, 
  FiFilter, 
  FiLoader, 
  FiAlertCircle,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEye
} from 'react-icons/fi';
import { toast } from 'sonner';

// Status filter options
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'PAID', label: 'Paid' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

// Memoized request row component
const RequestRow = ({ request }: { request: DsaRequest }) => {
  const statusBadge = useMemo(() => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      'UNPAID': { bg: 'bg-gray-100', text: 'text-gray-700' },
      'PAID': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'IN_PROGRESS': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'COMPLETED': { bg: 'bg-green-100', text: 'text-green-700' },
      'CANCELLED': { bg: 'bg-red-100', text: 'text-red-700' },
    };
    return statusMap[request.status] || statusMap['UNPAID'];
  }, [request.status]);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 sm:px-6 py-4">
        <div className="font-medium text-gray-900 text-sm">{request.serviceName}</div>
        <div className="text-xs text-gray-500 mt-1 sm:hidden">
          {request.userName}
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
        <div className="text-sm text-gray-900">{request.userName}</div>
        <div className="text-xs text-gray-500">{request.userEmail}</div>
      </td>
      <td className="px-4 sm:px-6 py-4">
        <span className={`px-2 py-1 text-xs rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
          {request.status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
        {new Date(request.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </td>
      <td className="px-4 sm:px-6 py-4">
        <Link
          href={`/dsa/requests/${request.id}`}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <FiEye size={16} />
          <span className="hidden sm:inline">View</span>
        </Link>
      </td>
    </tr>
  );
};

// Mobile request card
const RequestCard = ({ request }: { request: DsaRequest }) => {
  const statusBadge = useMemo(() => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      'UNPAID': { bg: 'bg-gray-100', text: 'text-gray-700' },
      'PAID': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'IN_PROGRESS': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'COMPLETED': { bg: 'bg-green-100', text: 'text-green-700' },
      'CANCELLED': { bg: 'bg-red-100', text: 'text-red-700' },
    };
    return statusMap[request.status] || statusMap['UNPAID'];
  }, [request.status]);

  return (
    <Link
      href={`/dsa/requests/${request.id}`}
      className="block bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm flex-1 pr-2">{request.serviceName}</h4>
        <span className={`px-2 py-1 text-xs rounded-full shrink-0 ${statusBadge.bg} ${statusBadge.text}`}>
          {request.status.replace('_', ' ')}
        </span>
      </div>
      <div className="text-sm text-gray-600 mb-1">{request.userName}</div>
      <div className="text-xs text-gray-400">{request.userEmail}</div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <span className="text-xs text-gray-500">
          {new Date(request.createdAt).toLocaleDateString('en-IN')}
        </span>
        <span className="text-blue-600 text-xs font-medium flex items-center gap-1">
          <FiEye size={14} /> View Details
        </span>
      </div>
    </Link>
  );
};

export default function DsaRequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial filters from URL
  const initialStatus = searchParams.get('status') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  
  const [filters, setFilters] = useState<DsaFilters>({
    status: initialStatus as RequestStatus | undefined,
    page: initialPage,
    limit: 10,
    sortBy: 'createdAt',
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch requests
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dsa-requests', filters],
    queryFn: () => dsaService.getRequests(filters),
    staleTime: 10000,
  });

  // Handle filter change
  const handleFilterChange = useCallback((key: keyof DsaFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined, page: key === 'page' ? value : 1 };
    setFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString());
    
    const queryString = params.toString();
    router.push(queryString ? `/dsa/requests?${queryString}` : '/dsa/requests', { scroll: false });
  }, [filters, router]);

  // Handle export
  const handleExport = async () => {
    try {
      toast.loading('Generating export...');
      const csv = await dsaService.exportRequests();
      
      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dsa-requests-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Export downloaded successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export requests');
    }
  };

  // Filter requests by search term (client-side for quick filtering)
  const filteredRequests = useMemo(() => {
    if (!data?.requests) return [];
    if (!searchTerm) return data.requests;
    
    const term = searchTerm.toLowerCase();
    return data.requests.filter(
      (req) =>
        req.serviceName.toLowerCase().includes(term) ||
        req.userName.toLowerCase().includes(term) ||
        req.userEmail.toLowerCase().includes(term)
    );
  }, [data?.requests, searchTerm]);

  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load requests</h3>
        <p className="text-gray-600 mb-4">Please try again.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Assigned Requests</h1>
          <p className="text-gray-600 text-sm mt-1">
            {pagination?.total || 0} total requests
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
        >
          <FiDownload size={18} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by service or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white min-w-[140px]"
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <FiFileText className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm || filters.status
              ? 'Try adjusting your filters.'
              : 'No requests have been assigned to you yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    User
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Created
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <RequestRow key={request.id} request={request} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {filteredRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border p-4">
              <button
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft size={18} />
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <button
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
