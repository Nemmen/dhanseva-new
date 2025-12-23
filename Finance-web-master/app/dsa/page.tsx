'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { dsaService } from '@/services/dsaService';
import { DsaSummary, DsaRequest } from '@/types/dsa.types';
import { useMemo } from 'react';
import Link from 'next/link';
import { 
  FiFileText, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle,
  FiArrowRight,
  FiLoader
} from 'react-icons/fi';

// Memoized stat card component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  color: string;
}) => {
  const colorClasses = useMemo(() => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'yellow': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'green': return 'bg-green-50 text-green-600 border-green-200';
      case 'red': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  }, [color]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 sm:p-6 ${colorClasses.split(' ')[2]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses.split(' ').slice(0, 2).join(' ')}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

// Memoized recent request card
const RecentRequestCard = ({ request }: { request: DsaRequest }) => {
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
      className="block p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 truncate flex-1">{request.serviceName}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
          {request.status.replace('_', ' ')}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">{request.userName}</span>
        <span className="text-gray-400">
          {new Date(request.createdAt).toLocaleDateString('en-IN')}
        </span>
      </div>
    </Link>
  );
};

export default function DsaDashboard() {
  const { user } = useAuth();
  
  // Fetch requests with summary
  const { data, isLoading, error } = useQuery({
    queryKey: ['dsa-requests', { limit: 5 }],
    queryFn: () => dsaService.getRequests({ limit: 5, sortBy: 'createdAt' }),
    staleTime: 30000, // 30 seconds
  });

  const summary: DsaSummary = useMemo(() => {
    return data?.summary || {
      totalAssigned: 0,
      inProgress: 0,
      completed: 0,
      onHold: 0,
    };
  }, [data?.summary]);

  const recentRequests = useMemo(() => {
    return data?.requests || [];
  }, [data?.requests]);

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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
        <p className="text-gray-600">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {user?.dsaProfile?.fullName?.split(' ')[0] || 'DSA'}!
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Here's an overview of your assigned work.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Total Assigned"
          value={summary.totalAssigned}
          icon={FiFileText}
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={summary.inProgress}
          icon={FiClock}
          color="yellow"
        />
        <StatCard
          title="Completed"
          value={summary.completed}
          icon={FiCheckCircle}
          color="green"
        />
        <StatCard
          title="On Hold"
          value={summary.onHold}
          icon={FiAlertCircle}
          color="red"
        />
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Requests</h2>
          <Link
            href="/dsa/requests"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            View All <FiArrowRight size={16} />
          </Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <RecentRequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FiFileText className="mx-auto mb-3 text-gray-300" size={48} />
            <p>No requests assigned yet.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dsa/requests?status=PAID"
          className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <h3 className="text-lg font-semibold mb-1">Pending Review</h3>
          <p className="text-blue-100 text-sm">View requests awaiting your action</p>
        </Link>
        <Link
          href="/dsa/requests?status=IN_PROGRESS"
          className="p-4 sm:p-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white hover:from-yellow-600 hover:to-orange-600 transition-all"
        >
          <h3 className="text-lg font-semibold mb-1">In Progress</h3>
          <p className="text-yellow-100 text-sm">Continue working on active requests</p>
        </Link>
      </div>
    </div>
  );
}
