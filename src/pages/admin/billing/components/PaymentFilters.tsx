import React, { useState, useCallback, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

interface PaymentFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  methodFilter?: string;
  onMethodChange?: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
  resultCount: number;
  onReset?: () => void;
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  methodFilter = '',
  onMethodChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  resultCount,
  onReset,
}) => {
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(debouncedSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearch, onSearchChange]);

  // Check if any filters are active
  const hasActiveFilters = searchValue || statusFilter || methodFilter;

  const handleReset = useCallback(() => {
    setDebouncedSearch('');
    onSearchChange('');
    onStatusChange('');
    onMethodChange?.('');
    onReset?.();
  }, [onSearchChange, onStatusChange, onMethodChange, onReset]);

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      {/* Main Filter Bar */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Search Input - Main Focus */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quick Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search customer, ID, method..."
                value={debouncedSearch}
                onChange={(e) => setDebouncedSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                aria-label="Search payments"
              />
              {debouncedSearch && (
                <button
                  onClick={() => setDebouncedSearch('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setExpandedFilters(!expandedFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 whitespace-nowrap ${
              expandedFilters
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-expanded={expandedFilters}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedFilters ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
              aria-label="Reset all filters"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchValue && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                <span>Search: {searchValue}</span>
                <button
                  onClick={() => {
                    setDebouncedSearch('');
                    onSearchChange('');
                  }}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {statusFilter && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <span>Status: {statusFilter}</span>
                <button
                  onClick={() => onStatusChange('')}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {methodFilter && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <span>Method: {methodFilter}</span>
                <button
                  onClick={() => onMethodChange?.('')}
                  className="hover:text-green-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expandable Advanced Filters */}
      {expandedFilters && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option value="Paid">✓ Paid</option>
                <option value="Not Yet Paid">⏳ Not Yet Paid</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={methodFilter}
                onChange={(e) => onMethodChange?.(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                aria-label="Filter by payment method"
              >
                <option value="">All Methods</option>
                <option value="GCash">GCash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="md:col-span-3 border-t border-gray-300 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortByChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  aria-label="Sort by"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="customer">Customer Name</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => onSortOrderChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  aria-label="Sort order"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Found <span className="font-semibold text-gray-900">{resultCount}</span>{' '}
          {resultCount === 1 ? 'payment' : 'payments'}
        </div>
        {searchValue && (
          <div className="text-xs text-gray-500">
            Searching for: <span className="font-medium">"{searchValue}"</span>
          </div>
        )}
      </div>
    </div>
  );
};
