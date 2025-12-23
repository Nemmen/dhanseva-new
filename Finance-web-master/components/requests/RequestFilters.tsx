'use client';

interface RequestFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPaymentStatus: string;
  onPaymentStatusChange: (status: string) => void;
}

export default function RequestFilters({
  selectedStatus,
  onStatusChange,
  selectedPaymentStatus,
  onPaymentStatusChange,
}: RequestFiltersProps) {
  const statusOptions = [
    { value: 'ALL', label: 'All Requests' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const paymentOptions = [
    { value: 'ALL', label: 'All Payments' },
    { value: 'UNPAID', label: 'Unpaid' },
    { value: 'PAID', label: 'Paid' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Request Status Filter */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Request Status</h3>
        <div className="space-y-1">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedStatus === option.value
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Status Filter */}
      <div className="pt-6 border-t">
        <h3 className="font-semibold text-gray-900 mb-3">Payment Status</h3>
        <div className="space-y-1">
          {paymentOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onPaymentStatusChange(option.value)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedPaymentStatus === option.value
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
