import React from 'react';
import { X, Printer } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  payment: {
    customer: string;
    amount: number;
    method: string;
    date: string;
    plan?: string;
  } | null;
  onClose: () => void;
  onPrint: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  payment,
  onClose,
  onPrint,
}) => {
  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Receipt</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          {/* Plan Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">
              Plan
            </p>
            <p className="text-lg font-bold text-gray-900">{payment.plan || 'Standard Plan'}</p>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 border-t border-b border-gray-200 py-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Customer</span>
              <span className="font-semibold text-gray-900">{payment.customer}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Amount</span>
              <span className="font-bold text-lg text-indigo-600">₱{payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Method</span>
              <span className="font-semibold text-gray-900">{payment.method}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Date</span>
              <span className="font-semibold text-gray-900">{new Date(payment.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Receipt #</span>
              <span className="font-semibold text-gray-900">RCP-{payment.customer.substring(0, 3).toUpperCase()}-{Math.random().toString(36).substring(7).toUpperCase()}</span>
            </div>
          </div>

          {/* Thank You */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">Thank you for your payment!</p>
            <p className="text-xs text-gray-500 mt-1">Your service is now active.</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={onPrint}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};
