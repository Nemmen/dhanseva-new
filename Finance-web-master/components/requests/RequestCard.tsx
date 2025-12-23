'use client';

import { ServiceRequest, RequestStatus } from '@/types/request.types';
import Link from 'next/link';
import { FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi';
import { format } from 'date-fns';

interface RequestCardProps {
  request: ServiceRequest;
}

export default function RequestCard({ request }: RequestCardProps) {
  const statusColors: Record<RequestStatus, string> = {
    UNPAID: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    PAID: 'bg-blue-100 text-blue-800 border-blue-300',
    IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-300',
    COMPLETED: 'bg-green-100 text-green-800 border-green-300',
    CANCELLED: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 truncate">
            {request.service?.name || 'Service'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            ID: <span className="font-mono">{request.id.slice(0, 8)}</span>
          </p>
        </div>
        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border whitespace-nowrap ${statusColors[request.status]}`}>
          {request.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <FiCalendar size={14} className="flex-shrink-0" />
          <span>Applied: {format(new Date(request.createdAt), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <FiDollarSign size={14} className="flex-shrink-0" />
          <span>Amount: ₹{request.service?.price || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Payment:</span>
          <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium ${
            request.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {request.paid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
        <Link
          href={`/my-requests/${request.id}`}
          className="flex-1 text-center px-3 sm:px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-xs sm:text-sm"
        >
          View Details
        </Link>
        {!request.paid && (
          <Link
            href={`/payment/${request.id}`}
            className="flex-1 text-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm"
          >
            Pay Now
          </Link>
        )}
      </div>
    </div>
  );
}
