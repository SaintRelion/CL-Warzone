import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface CashPaymentModalProps {
  isOpen: boolean;
  payment: {
    customer: string;
    amount: number;
  } | null;
  onClose: () => void;
  onComplete: (amountReceived: number) => void;
}

export const CashPaymentModal: React.FC<CashPaymentModalProps> = ({
  isOpen,
  payment,
  onClose,
  onComplete,
}) => {
  const [amountReceived, setAmountReceived] = useState<number>(0);

  const change = amountReceived - (payment?.amount || 0);
  const isValid = amountReceived >= (payment?.amount || 0);

  const handleQuickAdd = (amount: number) => {
    setAmountReceived((prev) => prev + amount);
  };

  const handleReset = () => {
    setAmountReceived(0);
  };

  const handleComplete = () => {
    if (isValid && payment) {
      onComplete(amountReceived);
      setAmountReceived(0);
      onClose();
    }
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Cash Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Customer</span>
            <span className="font-semibold text-gray-900">{payment.customer}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Amount Due</span>
            <span className="text-xl font-bold text-indigo-600">₱{payment.amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Received (₱)
          </label>
          <input
            type="number"
            value={amountReceived || ''}
            onChange={(e) => setAmountReceived(Number(e.target.value) || 0)}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="0"
            aria-label="Amount received"
            min="0"
          />
        </div>

        {/* Change Display */}
        {amountReceived > 0 && (
          <div
            className={`rounded-lg p-4 mb-6 flex items-center gap-3 ${
              isValid
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {isValid ? (
              <>
                <div className="flex-1">
                  <p className="text-sm text-green-700">Change</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₱{change.toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-700">
                    Insufficient amount
                  </p>
                  <p className="text-xs text-red-600">
                    Need ₱{(payment.amount - amountReceived).toLocaleString()} more
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {[100, 200, 500, 1000].map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickAdd(amount)}
              className="px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
            >
              +₱{amount}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={!isValid}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};
