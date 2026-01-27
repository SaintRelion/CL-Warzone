import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportControlsProps {
  month: number;
  year: number;
  status: string;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onStatusChange: (status: string) => void;
  onGenerateReport: () => void;
  onExportCSV: () => void;
  isLoading: boolean;
}

const ReportControls = ({
  month,
  year,
  status,
  onMonthChange,
  onYearChange,
  onStatusChange,
  onGenerateReport,
  onExportCSV,
  isLoading,
}: ReportControlsProps) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  // Sync with parent props
  useEffect(() => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [month, year]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleApplyDate = () => {
    onMonthChange(selectedMonth);
    onYearChange(selectedYear);
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-xl border-2 border-indigo-100 bg-linear-to-r from-indigo-50 via-purple-50 to-pink-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Monthly Payment Reports</h2>
            <p className="mt-1 text-sm text-gray-600">
              Generate and analyze payment reports by month
            </p>
          </div>
          <div className="rounded-full bg-white p-3 shadow-sm">
            <i className="fa-solid fa-file-invoice-dollar text-2xl text-indigo-600"></i>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <i className="fa-solid fa-filter text-indigo-600"></i>
          <h3 className="text-lg font-semibold text-gray-900">Report Filters</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Month & Year Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Period
            </label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start border-2 bg-white px-4 py-6 text-left font-medium transition-all hover:border-indigo-400 hover:bg-indigo-50",
                    "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-indigo-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {monthNames[month]} {year}
                    </span>
                    <span className="text-xs text-gray-500">Click to change</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-4">
                  <h4 className="font-semibold text-gray-900">Select Period</h4>
                  <p className="text-xs text-gray-600">Choose month and year for report</p>
                </div>
                <div className="space-y-4 p-4">
                  {/* Month Grid */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Month
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {monthNames.map((name, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedMonth(idx)}
                          className={cn(
                            "rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all",
                            selectedMonth === idx
                              ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                              : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                          )}
                        >
                          {name.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year Selection */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Year
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {years.map((y) => (
                        <button
                          key={y}
                          onClick={() => setSelectedYear(y)}
                          className={cn(
                            "rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all",
                            selectedYear === y
                              ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                              : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                          )}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="flex gap-2 border-t border-gray-200 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleApplyDate}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Payment Status
          </label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-18 w-full border-2 bg-white px-4 transition-all hover:border-indigo-400 hover:bg-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  status === "Paid" && "bg-green-100",
                  status === "Partially Paid" && "bg-yellow-100",
                  status === "Not Yet Paid" && "bg-red-100",
                  status === "all" && "bg-indigo-100"
                )}>
                  <i className={cn(
                    "fa-solid",
                    status === "Paid" && "fa-check-circle text-green-600",
                    status === "Partially Paid" && "fa-clock text-yellow-600",
                    status === "Not Yet Paid" && "fa-exclamation-circle text-red-600",
                    status === "all" && "fa-list text-indigo-600"
                  )}></i>
                </div>
                <div className="flex flex-col items-start">
                  <SelectValue>
                    <span className="text-sm font-semibold text-gray-900">
                      {status === "all" ? "All Statuses" : status}
                    </span>
                  </SelectValue>
                  <span className="text-xs text-gray-500">Filter by status</span>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-list text-indigo-600"></i>
                  <span>All Statuses</span>
                </div>
              </SelectItem>
              <SelectItem value="Paid">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check-circle text-green-600"></i>
                  <span>Paid</span>
                </div>
              </SelectItem>
              <SelectItem value="Partially Paid">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-clock text-yellow-600"></i>
                  <span>Partially Paid</span>
                </div>
              </SelectItem>
              <SelectItem value="Not Yet Paid">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-exclamation-circle text-red-600"></i>
                  <span>Not Yet Paid</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Action
          </label>
          <Button
            onClick={onGenerateReport}
            disabled={isLoading}
            className="h-18 w-full bg-linear-to-r from-indigo-600 to-purple-600 text-base font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-1">
                <i className="fa-solid fa-spinner fa-spin text-xl" />
                <span className="text-xs">Generating...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <i className="fa-solid fa-chart-line text-xl" />
                <span>Generate Report</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Export Section */}
      <div className="mt-6 flex items-center justify-between rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <i className="fa-solid fa-file-excel text-green-600"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Export Report</p>
            <p className="text-xs text-gray-600">Download as CSV file</p>
          </div>
        </div>
        <Button
          onClick={onExportCSV}
          disabled={isLoading}
          variant="outline"
          className="border-2 border-green-600 font-medium text-green-700 transition-all hover:bg-green-50"
        >
          <i className="fa-solid fa-download mr-2" />
          Export CSV
        </Button>
      </div>
      </div>
    </div>
  );
};

export default ReportControls;
