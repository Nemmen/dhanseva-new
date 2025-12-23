'use client';

import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

interface PaymentStatusProps {
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  size?: 'sm' | 'md' | 'lg';
}

export default function PaymentStatus({ status, size = 'md' }: PaymentStatusProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const config = {
    PENDING: {
      icon: FiClock,
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    COMPLETED: {
      icon: FiCheckCircle,
      label: 'Paid',
      className: 'bg-green-100 text-green-800 border-green-300',
    },
    FAILED: {
      icon: FiXCircle,
      label: 'Failed',
      className: 'bg-red-100 text-red-800 border-red-300',
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${className} ${sizeClasses[size]}`}
    >
      <Icon size={iconSizes[size]} />
      {label}
    </span>
  );
}
