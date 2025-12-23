'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { employeeService } from '@/services/employeeService';
import { EmployeeRequest, EmployeeFilters, RequestStatus } from '@/types/employee.types';
import {
  FiSearch,
  FiFilter,
  FiLoader,
  FiAlertCircle,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiUsers,
  FiDollarSign,
  FiX,
} from 'react-icons/fi';

// Status filter options
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'PAID', label: 'Paid' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

// Payment filter options
const PAYMENT_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Payments' },
  { value: 'true', label: 'Paid' },
  { value: 'false', label: 'Unpaid' },
];

// Request row component
const RequestRow = ({ request }: { request: EmployeeRequest }) => {
  const statusColors: Record<string, string> = {
    UNPAID: 'bg-gray-100 text-gray-700',
    PAID: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 text-sm">{request.serviceName}</div>
        <div className="text-xs text-gray-500 font-mono mt-0.5">
          {request.id.slice(0, 8)}...
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <div className="text-sm text-gray-900">{request.userName}</div>
        <div className="text-xs text-gray-500">{request.userEmail}</div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-sm text-gray-700">{request.userCity || 'N/A'}</span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            statusColors[request.status] || statusColors.UNPAID
          }`}
        >
          {request.status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        {request.paid ? (
          <span className="inline-flex items-center gap-1 text-green-600 text-sm">
            <FiDollarSign size={14} /> Paid
          </span>
        ) : (
          <span className="text-gray-400 text-sm">Unpaid</span>
        )}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        {request.assignedDsa ? (
          <div className="text-sm">
            <span className="text-gray-900">{request.assignedDsa.name}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Unassigned</span>
        )}
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">
        {new Date(request.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        })}
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/employee/requests/${request.id}`}
          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          <FiEye size={16} />
          <span className="hidden sm:inline">View</span>
        </Link>
      </td>
    </tr>
  );
};

// Mobile card component
const RequestCard = ({ request }: { request: EmployeeRequest }) => {
  const statusColors: Record<string, string> = {
    UNPAID: 'bg-gray-100 text-gray-700',
    PAID: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <Link
      href={`/employee/requests/${request.id}`}
      className="block bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm flex-1 pr-2">{request.serviceName}</h4>
        <span
          className={`px-2 py-1 text-xs rounded-full shrink-0 font-medium ${
            statusColors[request.status] || statusColors.UNPAID
          }`}
        >
          {request.status.replace('_', ' ')}
        </span>
      </div>
      <div className="text-sm text-gray-600">{request.userName}</div>
      <div className="text-xs text-gray-400">{request.userEmail}</div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <div className="flex items-center gap-3">
          <span className={`text-xs ${request.paid ? 'text-green-600' : 'text-gray-400'}`}>
            {request.paid ? '✓ Paid' : 'Unpaid'}
          </span>
          {request.assignedDsa && (
            <span className="text-xs text-indigo-600 flex items-center gap-1">
              <FiUsers size={12} /> {request.assignedDsa.name}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {new Date(request.createdAt).toLocaleDateString('en-IN')}
        </span>
      </div>
    </Link>
  );
};

export default function EmployeeRequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial filters from URL
  const initialStatus = searchParams.get('status') || '';
  const initialPaid = searchParams.get('paid') || '';
  const initialDsa = searchParams.get('assignedDsa') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [filters, setFilters] = useState<EmployeeFilters>({
    status: initialStatus as RequestStatus | undefined,
    paid: initialPaid ? initialPaid === 'true' : undefined,
    assignedDsa: initialDsa || undefined,
    page: initialPage,
    limit: 20,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch requests
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['employee-requests', filters],
    queryFn: () => employeeService.getRequests(filters),
    staleTime: 10000,
  });

  // Handle filter change
  const handleFilterChange = useCallback(
    (key: keyof EmployeeFilters, value: any) => {
      const newFilters = {
        ...filters,
        [key]: value || undefined,
        page: key === 'page' ? value : 1,
      };
      setFilters(newFilters);

      // Update URL
      const params = new URLSearchParams();
      if (newFilters.status) params.set('status', newFilters.status);
      if (newFilters.paid !== undefined) params.set('paid', String(newFilters.paid));
      if (newFilters.assignedDsa) params.set('assignedDsa', newFilters.assignedDsa);
      if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString());

      const queryString = params.toString();
      router.push(queryString ? `/employee/requests?${queryString}` : '/employee/requests', {
        scroll: false,
      });
    },
    [filters, router]
  );

  // Clear all filters
  const clearFilters = () => {
    setFilters({ page: 1, limit: 20 });
    setSearchTerm('');
    router.push('/employee/requests', { scroll: false });
  };

  // Filter requests by search term (client-side)
  const filteredRequests = useMemo(() => {
    if (!data?.requests) return [];
    if (!searchTerm) return data.requests;

    const term = searchTerm.toLowerCase();
    return data.requests.filter(
      (req) =>
        req.serviceName.toLowerCase().includes(term) ||
        req.userName.toLowerCase().includes(term) ||
        req.userEmail.toLowerCase().includes(term) ||
        req.id.toLowerCase().includes(term)
    );
  }, [data?.requests, searchTerm]);

  const pagination = data?.pagination;
  const analytics = data?.analytics;
  const hasActiveFilters = filters.status || filters.paid !== undefined || filters.assignedDsa;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <FiLoader className="animate-spin text-indigo-600" size={48} />
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
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Requests</h1>
          <p className="text-gray-600 text-sm mt-1">{pagination?.total || 0} total requests</p>
        </div>

        {/* Analytics Pills */}
        {analytics && (
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
              {analytics.unpaid} Unpaid
            </span>
            <span className="px-3 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-700">
              {analytics.assigned} Assigned
            </span>
            <span className="px-3 py-1 bg-yellow-100 rounded-full text-xs font-medium text-yellow-700">
              {analytics.inProgress} In Progress
            </span>
            <span className="px-3 py-1 bg-green-100 rounded-full text-xs font-medium text-green-700">
              {analytics.completed} Completed
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by service, user, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              aria-label="Filter by status"
              className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none bg-white min-w-36"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Filter */}
          <select
            value={filters.paid === undefined ? '' : String(filters.paid)}
            onChange={(e) =>
              handleFilterChange('paid', e.target.value ? e.target.value === 'true' : undefined)
            }
            aria-label="Filter by payment"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none bg-white min-w-32"
          >
            {PAYMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Assignment Filter */}
          <select
            value={filters.assignedDsa || ''}
            onChange={(e) => handleFilterChange('assignedDsa', e.target.value)}
            aria-label="Filter by assignment"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none bg-white min-w-36"
          >
            <option value="">All Assignments</option>
            <option value="null">Unassigned</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <FiX size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <FiFileText className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm || hasActiveFilters
              ? 'Try adjusting your filters.'
              : 'No service requests have been submitted yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      City
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Assigned DSA
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
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
                disabled={pagination.page >= pagination.pages}
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
