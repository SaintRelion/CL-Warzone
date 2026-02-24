import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAdminReportingStore,
  type FilterStatus,
} from "@/stores/admin-reporting/useAdminReportingStore";
import GenerateReport from "./GenerateReport";
import ExportReport from "./ExportReport";
import { MONTH_NAMES } from "./constants";

const MonthButton = ({
  name,
  selected,
  onClick,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all",
      selected
        ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
        : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50",
    )}
  >
    {name.slice(0, 3)}
  </button>
);

const YearButton = ({
  year,
  selected,
  onClick,
}: {
  year: number;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-lg border-2 py-2 text-sm font-medium transition-all",
      selected
        ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
        : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50",
    )}
  >
    {year}
  </button>
);

const StatusIcon = ({ status }: { status: "Paid" | "Unpaid" | "all" }) => {
  const map = {
    Paid: { icon: "fa-check-circle", color: " text-green-600 " },
    Unpaid: { icon: "fa-exclamation-circle", color: " text-red-600 " },
    all: { icon: "fa-list", color: " text-indigo-600 " },
  };

  return (
    <div
      className={`flex h-7 w-7 items-center justify-center ${map[status].color}`}
    >
      <i className={`fa-solid ${map[status].icon}`} />
    </div>
  );
};

const filterStatuses: FilterStatus[] = ["all", "Paid", "Unpaid"];

const ReportControls = () => {
  const dateToReport = useAdminReportingStore((s) => s.dateToReport);
  const viewReport = useAdminReportingStore((s) => s.viewReport);
  const setDateToReport = useAdminReportingStore((s) => s.setDateToReport);
  const clearDateToReport = useAdminReportingStore((s) => s.clearDateToReport);

  const setStatusFilter = useAdminReportingStore((s) => s.setStatusFilter);

  const [isOpen, setIsOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const [monthToReport, setMonthToReport] = useState(0);
  const [yearToReport, setYearToReport] = useState(currentYear);

  const handleApplyDate = () => {
    setDateToReport(monthToReport, yearToReport);
    setIsOpen(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <i className="fa-solid fa-filter text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Report Filters</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Month & Year Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Period</label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start border bg-white px-4 py-6 text-left font-medium transition-all hover:border-indigo-400 hover:bg-indigo-50",
                  "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-indigo-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {MONTH_NAMES[dateToReport[0]]} {dateToReport[1]}
                  </span>
                  <span className="text-xs text-gray-500">Click to change</span>
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-80 bg-white p-0 shadow-lg"
              side="right"
              align="start"
            >
              <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-4">
                <h4 className="font-semibold text-gray-900">Select Period</h4>
                <p className="text-xs text-gray-600">
                  Choose month and year for report
                </p>
              </div>

              <div className="space-y-4 p-4">
                {/* Month Grid */}
                <div>
                  <label className="mb-2 block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    Month
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {MONTH_NAMES.map((name, idx) => (
                      <MonthButton
                        key={idx}
                        name={name}
                        selected={monthToReport === idx}
                        onClick={() => {
                          setMonthToReport(idx);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Year Grid */}
                <div>
                  <label className="mb-2 block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    Year
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {years.map((y) => (
                      <YearButton
                        key={y}
                        year={y}
                        selected={yearToReport === y}
                        onClick={() => {
                          setYearToReport(y);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 border-t border-gray-200 pt-4">
                  {" "}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      clearDateToReport();
                      viewReport(null);
                    }}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleApplyDate}
                    className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
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
          <Select onValueChange={setStatusFilter}>
            <SelectTrigger className="h-18 w-full border bg-white px-4 py-6 transition-all hover:border-indigo-400 hover:bg-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
              <div className="flex items-center gap-3">
                <SelectValue
                  placeholder="Filter by status"
                  className="text-sm font-semibold text-gray-900"
                />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {filterStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  <div className="flex items-center gap-1">
                    <StatusIcon status={s} />
                    <span>{s === "all" ? "All Status" : s}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generate Report */}
        <GenerateReport />
      </div>

      {/* Export Section */}
      <ExportReport />
    </div>
  );
};

export default ReportControls;
