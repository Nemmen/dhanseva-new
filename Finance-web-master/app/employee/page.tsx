'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { employeeService } from '@/services/employeeService';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiAlertTriangle,
  FiLoader,
  FiArrowRight,
  FiUsers,
  FiTrendingUp,
} from 'react-icons/fi';

// KPI Card Component
const KpiCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'indigo' | 'purple';
  trend?: { value: number; isPositive: boolean };
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    indigo: 'bg-indigo-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className={`bg-white rounded-xl border p-4 sm:p-6 ${colorClasses[color].split(' ')[2]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <FiTrendingUp
                className={trend.isPositive ? 'text-green-500' : 'text-red-500 rotate-180'}
                size={14}
              />
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.value}% from last week
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
          <Icon className={colorClasses[color].split(' ')[1]} size={24} />
        </div>
      </div>
    </div>
  );
};

// Recent Request Row
const RecentRequestRow = ({
  request,
}: {
  request: {
    id: string;
    serviceName: string;
    userName: string;
    status: string;
    paid: boolean;
    createdAt: string;
  };
}) => {
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
      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate text-sm">{request.serviceName}</p>
        <p className="text-xs text-gray-500 mt-0.5">{request.userName}</p>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[request.status] || statusColors.UNPAID
          }`}
        >
          {request.status.replace('_', ' ')}
        </span>
        <FiArrowRight className="text-gray-400" size={16} />
      </div>
    </Link>
  );
};

export default function EmployeeOverviewPage() {
  // Fetch requests with analytics
  const { data, isLoading, error } = useQuery({
    queryKey: ['employee-overview'],
    queryFn: () => employeeService.getRequests({ limit: 10 }),
  });

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
        <FiAlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
        <p className="text-gray-600">Please refresh the page to try again.</p>
      </div>
    );
  }

  const analytics = data?.analytics || {
    totalRequests: 0,
    unpaid: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
  };

  const recentRequests = data?.requests || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Monitor operations and manage service requests</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Requests"
          value={analytics.totalRequests}
          icon={FiFileText}
          color="indigo"
        />
        <KpiCard
          title="Unpaid"
          value={analytics.unpaid}
          icon={FiDollarSign}
          color="yellow"
        />
        <KpiCard
          title="Assigned"
          value={analytics.assigned}
          icon={FiUsers}
          color="blue"
        />
        <KpiCard
          title="In Progress"
          value={analytics.inProgress}
          icon={FiClock}
          color="purple"
        />
        <KpiCard
          title="Completed"
          value={analytics.completed}
          icon={FiCheckCircle}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/employee/requests?status=PAID"
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUsers className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-blue-900">Assign DSAs</p>
              <p className="text-sm text-blue-600">
                {analytics.assigned} paid requests need assignment
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/employee/requests?status=IN_PROGRESS"
          className="bg-purple-50 border border-purple-200 rounded-xl p-4 hover:bg-purple-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiClock className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-purple-900">Monitor Progress</p>
              <p className="text-sm text-purple-600">
                {analytics.inProgress} requests in progress
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/employee/dsa"
          className="bg-green-50 border border-green-200 rounded-xl p-4 hover:bg-green-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiUsers className="text-green-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-green-900">DSA Directory</p>
              <p className="text-sm text-green-600">Manage DSA agents</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
          <Link
            href="/employee/requests"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            View All
            <FiArrowRight size={16} />
          </Link>
        </div>
        <div className="divide-y">
          {recentRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiFileText className="mx-auto mb-3 text-gray-300" size={40} />
              <p>No requests yet</p>
            </div>
          ) : (
            recentRequests.slice(0, 5).map((request) => (
              <RecentRequestRow key={request.id} request={request} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
