'use client';

interface PaymentSummaryProps {
  serviceName: string;
  servicePrice: number;
  tax?: number;
  discount?: number;
}

export default function PaymentSummary({
  serviceName,
  servicePrice,
  tax = 0,
  discount = 0,
}: PaymentSummaryProps) {
  const total = servicePrice + tax - discount;

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Summary</h3>

      <div className="space-y-2 sm:space-y-3">
        {/* Service */}
        <div className="flex justify-between text-gray-700 text-sm sm:text-base">
          <span>Service:</span>
          <span className="font-medium text-right ml-2">{serviceName}</span>
        </div>

        {/* Service Fee */}
        <div className="flex justify-between text-gray-700 text-sm sm:text-base">
          <span>Service Fee:</span>
          <span className="font-medium">₹{servicePrice.toFixed(2)}</span>
        </div>

        {/* Tax */}
        {tax > 0 && (
          <div className="flex justify-between text-gray-700 text-sm sm:text-base">
            <span>GST (18%):</span>
            <span className="font-medium">₹{tax.toFixed(2)}</span>
          </div>
        )}

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600 text-sm sm:text-base">
            <span>Discount:</span>
            <span className="font-medium">-₹{discount.toFixed(2)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-300 pt-2 sm:pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-600">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3">
        <p className="text-xs sm:text-sm text-blue-800">
          💡 <strong>Note:</strong> Amount will be charged only once. No hidden charges.
        </p>
      </div>
    </div>
  );
}
