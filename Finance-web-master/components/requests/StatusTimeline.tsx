'use client';

import { RequestStatus } from '@/types/request.types';
import { format } from 'date-fns';

interface StatusTimelineProps {
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export default function StatusTimeline({ status, createdAt, updatedAt }: StatusTimelineProps) {
  const steps = [
    { status: 'UNPAID', label: 'Application Submitted', icon: '📝' },
    { status: 'IN_PROGRESS', label: 'Under Review', icon: '🔍' },
    { status: 'COMPLETED', label: 'Completed', icon: '✅' },
  ];

  const getStepIndex = () => {
    switch (status) {
      case 'UNPAID':
      case 'PAID':
        return 0;
      case 'IN_PROGRESS':
        return 1;
      case 'COMPLETED':
        return 2;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex();

  if (status === 'CANCELLED') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-800">
          <span className="text-3xl">❌</span>
          <div>
            <h3 className="font-semibold text-lg">Application Cancelled</h3>
            <p className="text-sm">Updated on {format(new Date(updatedAt), 'MMM dd, yyyy HH:mm')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Application Timeline</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="flex gap-4">
              {/* Icon */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isCompleted
                      ? 'bg-blue-100 border-2 border-blue-600'
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}
                >
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 my-1 ${
                      isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <h4
                  className={`font-semibold ${
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </h4>
                {isCurrent && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    Current Status
                  </p>
                )}
                {isCompleted && (
                  <p className="text-sm text-gray-600 mt-1">
                    {index === 0
                      ? format(new Date(createdAt), 'MMM dd, yyyy HH:mm')
                      : format(new Date(updatedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
