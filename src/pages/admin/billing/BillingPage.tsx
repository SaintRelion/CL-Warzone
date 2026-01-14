import { PLANS } from "@/constants";
import { useActivityLogger } from "@/lib/activity-logger";
import type { BillingInfo, UpdateBilling } from "@/models/Billing";
import type {
  CreatePaymentHistory,
  PaymentHistory,
} from "@/models/PaymentHistory";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import {
  formatReadableDate,
  formatReadableDateTime,
  getCurrentDateTimeString,
} from "@saintrelion/time-functions";
import { useState, useRef, useMemo } from "react";

const BillingPage = () => {
  const { log } = useActivityLogger();

  const { useUpdate: updateBilling } = useResourceLocked<
    never,
    never,
    UpdateBilling
  >("billing");
  const { useList: getUserBillings } =
    useResourceLocked<BillingInfo>("userbillings");
  const { useList: getPaymentHistory, useInsert: insertPaymentHistory } =
    useResourceLocked<PaymentHistory, CreatePaymentHistory>("paymenthistory");

  const userBillings = getUserBillings().data;
  const paymentHistories = getPaymentHistory().data;

  const receiptRef = useRef<HTMLDivElement>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentHistory | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Cashiering state
  const [cashierBehavior, setCashierBehavior] = useState<{
    action: string;
    customerId: string;
  }>({
    action: "",
    customerId: "",
  });

  let selectedCustomerBill: BillingInfo | undefined;
  if (
    cashierBehavior.customerId != "" &&
    userBillings &&
    userBillings.length > 0
  )
    selectedCustomerBill =
      userBillings.filter((b) => b.userId == cashierBehavior.customerId)[0] ??
      undefined;

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [transactionRef, setTransactionRef] = useState("");
  const [transactionScreenshot, setTransactionScreenshot] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);

  // Payment history and update states
  const [updateBill, setUpdateBill] = useState<BillingInfo | null>(null);
  const [updateForm, setUpdateForm] = useState<Partial<PaymentHistory>>({});

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Stats for summary cards
  const totalPaid = userBillings
    ? userBillings.filter((p) => p.status === "Paid").length
    : 0;
  const totalUnpaid = userBillings
    ? userBillings.filter((p) => p.status === "Not Yet Paid").length
    : 0;
  const totalThisMonth = userBillings
    ? userBillings.filter((p) => {
        const paymentDate = new Date(p.createdAt);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      }).length
    : 0;
  const totalRevenue = userBillings
    ? userBillings
        .filter((p) => p.status === "Paid")
        .reduce((sum, p) => sum + parseInt(p.amount), 0)
    : 0;

  const filteredAndSortBilling = useMemo(() => {
    let result = userBillings ? [...userBillings] : [];

    if (searchTerm) {
      result = result.filter(
        (bill) =>
          bill.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.userId.toString().includes(searchTerm),
      );
    }

    if (statusFilter === "paid") {
      result = result.filter((p) => p.status === "Paid");
    } else if (statusFilter === "not-paid") {
      result = result.filter((p) => p.status === "Not Yet Paid");
    } else if (statusFilter === "current-month") {
      result = result.filter((p) => {
        const paymentDate = new Date(p.createdAt);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      });
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "amount") {
        comparison = parseInt(a.amount) - parseInt(b.amount);
      } else if (sortBy === "customer") {
        comparison = a.customer.localeCompare(b.customer);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    userBillings,
    searchTerm,
    statusFilter,
    currentMonth,
    currentYear,
    sortBy,
    sortOrder,
  ]);

  const totalPages = Math.ceil(filteredAndSortBilling.length / itemsPerPage);
  const paginatedBillings = filteredAndSortBilling.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleFilterChange = (filter: string): void => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const printReceipt = (): void => {
    if (!receiptRef.current) return;

    const content = receiptRef.current.innerHTML;
    const win = window.open("", "", "width=400,height=700");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Receipt</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              line-height: 1.4;
              width: 80mm;
              background: white;
              padding: 8px;
            }
            @page {
              size: 80mm auto;
              margin: 0;
              padding: 0;
            }
            @media print {
              body {
                margin: 0;
                padding: 8px;
              }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    win.document.close();
    setTimeout(() => {
      win.print();
    }, 250);
  };

  const handleScreenshotUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTransactionScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateChange = (received: string): void => {
    const amount = parseFloat(received) || 0;
    const due = parseInt(selectedCustomerBill?.amount ?? "0");
    setChange(Math.max(0, amount - due));
  };

  const completeCashPayment = async (): Promise<void> => {
    if (!selectedCustomerBill) return;

    const received = parseFloat(amountReceived) || 0;
    if (received >= parseInt(selectedCustomerBill.amount)) {
      const completedPayment: CreatePaymentHistory = {
        billId: selectedCustomerBill.id,
        userId: selectedCustomerBill.userId,
        method: paymentMethod,
        amount: received.toString(),
        change: change.toString(),
        status: "Paid",
        transactionScreenshot: transactionScreenshot,
        transactionRef: paymentMethod !== "Cash" ? transactionRef : "",
        nextBillingDate: selectedCustomerBill.nextBillingDate,
      };

      await insertPaymentHistory.run(completedPayment);
      await updateBilling.run({
        id: selectedCustomerBill.id,
        payload: { status: "Paid" },
      });

      const plan = PLANS.filter((f) => f.id == selectedCustomerBill.planId)[0];
      await log({
        action: "Payment Processed",
        category: "billing",
        description: `Processed GCash payment ₱${received} for ${selectedCustomerBill.customer} - Plan: ${plan.name}`,
        status: "success",
        additionalInfo: {
          amount: "1500",
          paymentMethod: "GCash",
          planName: "Fiber 50Mbps",
        },
      });

      setSelectedReceipt({
        id: "",
        billId: selectedCustomerBill.id,
        userId: selectedCustomerBill.userId,
        customer: selectedCustomerBill.customer,
        method: paymentMethod,
        amount: received.toString(),
        change: change.toString(),
        status: "Paid",
        transactionScreenshot: transactionScreenshot,
        transactionRef: paymentMethod !== "Cash" ? transactionRef : "",
        createdAt: formatReadableDateTime(getCurrentDateTimeString()),
        nextBillingDate: selectedCustomerBill.nextBillingDate,
      });

      setCashierBehavior({ action: "", customerId: "" });

      // Automatically print receipt after DOM update
      setTimeout(() => {
        printReceipt();
      }, 300);
    } else {
      alert("Insufficient amount received!");
    }
  };

  // Handler for analytics card clicks
  const handleAnalyticsClick = (type: string): void => {
    if (type === "paid") {
      setStatusFilter("paid");
    } else if (type === "unpaid") {
      setStatusFilter("not-paid");
    } else if (type === "month") {
      setStatusFilter("current-month");
    } else {
      setStatusFilter("all");
    }
    setCurrentPage(1);
  };

  // Handler for saving payment updates
  const handleSavePaymentUpdate = (): void => {
    if (!updateBill || !updateForm.status || !updateForm.method) {
      alert("Please fill in all required fields!");
      return;
    }
    alert(`Payment #${updateBill.id} updated successfully!`);
    setCashierBehavior({ action: "", customerId: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        <div>
          <h2 className="mb-1 text-4xl font-black text-gray-900">
            Cashiering & Billing
          </h2>
          <p className="text-sm font-semibold text-gray-700">
            Manage payments, receipts, and billing cycles
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => handleAnalyticsClick("paid")}
            className="transform rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:ring-indigo-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-indigo-600">Total Paid</p>
                <p className="mt-1 text-3xl font-black text-indigo-700">
                  {totalPaid}
                </p>
              </div>
              <div className="text-4xl opacity-20">✓</div>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-indigo-200">
              <div
                className="h-1.5 rounded-full bg-indigo-600"
                style={{
                  width: `${(totalPaid / (userBillings?.length ?? 0)) * 100}%`,
                }}
              ></div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleAnalyticsClick("unpaid")}
            className="transform rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:ring-yellow-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-yellow-600">Unpaid</p>
                <p className="mt-1 text-3xl font-black text-yellow-700">
                  {totalUnpaid}
                </p>
              </div>
              <div className="text-4xl opacity-20">⏳</div>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-yellow-200">
              <div
                className="h-1.5 rounded-full bg-yellow-500"
                style={{
                  width: `${(totalUnpaid / (userBillings?.length ?? 0)) * 100}%`,
                }}
              ></div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleAnalyticsClick("month")}
            className="transform rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:ring-green-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-green-600">This Month</p>
                <p className="mt-1 text-3xl font-black text-green-700">
                  {totalThisMonth}
                </p>
              </div>
              <div className="text-4xl opacity-20">📅</div>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-green-200">
              <div
                className="h-1.5 rounded-full bg-green-500"
                style={{
                  width: `${(totalThisMonth / (userBillings?.length ?? 0)) * 100}%`,
                }}
              ></div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleAnalyticsClick("all")}
            className="transform rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:ring-purple-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-purple-600">
                  Total Revenue
                </p>
                <p className="mt-1 text-3xl font-black text-purple-700">
                  ₱{totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl opacity-20">💰</div>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-purple-200">
              <div
                className="h-1.5 rounded-full bg-purple-500"
                style={{ width: "100%" }}
              ></div>
            </div>
          </button>
        </div>

        {/* FILTERS AND SEARCH - MINIMALIST */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          {/* Search */}
          <div className="relative min-w-[250px] flex-1">
            <input
              type="text"
              placeholder="Search customer, method, ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-9 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            title="Filter by status"
          >
            <option value="all">📋 All</option>
            <option value="paid">✓ Paid</option>
            <option value="not-paid">⏳ Pending</option>
            <option value="current-month">📅 This Month</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            title="Sort by"
          >
            <option value="date">📅 Date</option>
            <option value="amount">💰 Amount</option>
            <option value="customer">👤 Customer</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            title={`Sort ${sortOrder === "desc" ? "ascending" : "descending"}`}
          >
            {sortOrder === "desc" ? "↓" : "↑"}
          </button>

          {/* Results Count */}
          <div className="ml-auto text-xs whitespace-nowrap text-gray-600">
            {paginatedBillings.length} / {filteredAndSortBilling.length}
          </div>
        </div>

        {/* DATA TABLE - Improved UI */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black tracking-wider text-gray-700 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black tracking-wider text-gray-700 uppercase">
                    Amount
                  </th>
                  {/* <th className="px-4 py-3 text-left text-xs font-black tracking-wider text-gray-700 uppercase">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black tracking-wider text-gray-700 uppercase">
                    Payment Date
                  </th> */}
                  <th className="px-4 py-3 text-left text-xs font-black tracking-wider text-gray-700 uppercase">
                    Next Billing Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black tracking-wider text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black tracking-wider text-gray-700 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedBillings.map((bill, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors duration-150 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50/60`}
                  >
                    <td className="px-4 py-3 font-bold whitespace-nowrap text-gray-900">
                      {bill.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                      <span className="font-black">₱{bill.amount}</span>
                    </td>
                    {/* <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {bill.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {bill.createdAt}
                    </td> */}
                    <td className="px-4 py-3 font-black whitespace-nowrap text-indigo-600">
                      {formatReadableDateTime(bill.nextBillingDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm transition-colors duration-150 ${
                          bill.status === "Paid"
                            ? "border border-green-200 bg-green-100 text-green-700"
                            : "border border-yellow-200 bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {bill.status === "Paid" ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-1 h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Paid
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-1 h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Not Yet Paid
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Print Receipt Button - Only for Paid Payments */}
                        {bill.status === "Paid" && (
                          <button
                            onClick={() => {
                              const paymentHistory = paymentHistories?.filter(
                                (h) => h.billId == bill.id,
                              )[0];

                              if (paymentHistory)
                                setSelectedReceipt({
                                  id: paymentHistory.id,
                                  billId: paymentHistory.billId,
                                  userId: paymentHistory.userId,
                                  customer: paymentHistory.customer,
                                  method: paymentHistory.method,
                                  amount: paymentHistory.amount,
                                  change: paymentHistory.change,
                                  status: paymentHistory.status,
                                  transactionScreenshot:
                                    paymentHistory.transactionScreenshot,
                                  transactionRef: paymentHistory.transactionRef,
                                  createdAt: formatReadableDateTime(
                                    paymentHistory.createdAt,
                                  ),
                                  nextBillingDate:
                                    paymentHistory.nextBillingDate,
                                });
                            }}
                            title="Print Receipt - View and print payment receipt"
                            className="rounded-lg bg-indigo-600 p-2 text-white shadow transition-all duration-150 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:outline-none active:scale-95"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.08-2.66c-.2-.26-.53-.4-.85-.4-.32 0-.65.14-.86.4l-2.3 2.92c-.27.34-.25.85.05 1.17.3.32.77.34 1.09.05L6.5 9.75l2.08 2.66c.2.26.53.4.85.4.32 0 .65-.14.85-.4l2.75-3.54c.27-.34.25-.85-.05-1.17-.3-.32-.77-.34-1.09-.05z" />
                            </svg>
                          </button>
                        )}

                        {/* Cashiering Button - Only for Pending Payments */}
                        {bill.status === "Not Yet Paid" && (
                          <button
                            onClick={() =>
                              setCashierBehavior({
                                action: "payment",
                                customerId: bill.userId,
                              })
                            }
                            title="Process Payment - Collect payment from customer"
                            className="rounded-lg bg-green-600 p-2 text-white shadow transition-all duration-150 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:outline-none active:scale-95"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          </button>
                        )}

                        {/* View Payment History Button */}
                        <button
                          onClick={() =>
                            setCashierBehavior({
                              action: "paymenthistory",
                              customerId: bill.userId,
                            })
                          }
                          title="View Payment History - See all payments from this customer"
                          className="rounded-lg bg-blue-600 p-2 text-white shadow transition-all duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none active:scale-95"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        </button>

                        {/* Update Payment Button - Only for Paid Payments */}
                        {bill.status === "Paid" && (
                          <button
                            onClick={() => setUpdateBill(bill)}
                            title="Update Payment - Edit payment status and method only"
                            className="rounded-lg bg-amber-600 p-2 text-white shadow transition-all duration-150 hover:bg-amber-700 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none active:scale-95"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                              <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded px-3 py-1 text-sm font-medium ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* RECEIPT PREVIEW - THERMAL PRINTER FORMAT */}
        {selectedReceipt && (
          <div className="animate-fadeIn rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
            <div
              ref={receiptRef}
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "12px",
                lineHeight: "1.4",
                width: "80mm",
                margin: "0",
                padding: "8px",
                backgroundColor: "white",
              }}
            >
              {/* STORE HEADER */}
              <div className="mb-2 text-center">
                <div className="text-xl font-black">WARZONE</div>
                <div className="text-xs font-semibold">
                  Internet Services Provider
                </div>
                <div className="text-xs text-gray-600">
                  Metro Manila, Philippines
                </div>
              </div>

              {/* DIVIDER */}
              <div className="mb-3 text-center text-xs font-bold">
                ........................................
              </div>

              {/* RECEIPT INFO */}
              <div className="mb-3 space-y-1 text-xs">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>RECEIPT NO:</span>
                  <span className="font-bold" style={{ textAlign: "right" }}>
                    OR-{selectedReceipt.id.toString().padStart(6, "0")}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>DATE:</span>
                  <span className="font-bold" style={{ textAlign: "right" }}>
                    {formatReadableDate(getCurrentDateTimeString())}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>TIME:</span>
                  <span className="font-bold" style={{ textAlign: "right" }}>
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="mb-3 text-center text-xs font-bold">
                ........................................
              </div>

              {/* CUSTOMER INFO */}
              <div className="mb-3 space-y-1 text-xs">
                <div className="font-bold">CUSTOMER DETAILS</div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>Name:</span>
                  <span className="font-bold" style={{ textAlign: "right" }}>
                    {selectedReceipt.customer}
                  </span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="mb-3 text-center text-xs font-bold">
                ........................................
              </div>

              {/* SERVICE DETAILS */}
              <div className="mb-3 space-y-1 text-xs">
                <div className="font-bold">SERVICE DETAILS</div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>Service:</span>
                  <span style={{ textAlign: "right" }}>
                    Internet Subscription
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>Plan:</span>
                  <span style={{ textAlign: "right" }}>
                    Monthly • Unlimited
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>Cycle:</span>
                  <span style={{ textAlign: "right" }}>30 Days</span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="mb-3 text-center text-xs font-bold">
                ........................................
              </div>

              {/* PAYMENT DETAILS */}
              <div className="mb-3 space-y-1 text-xs">
                <div className="font-bold">PAYMENT DETAILS</div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>Amount Due:</span>
                  <span className="font-bold" style={{ textAlign: "right" }}>
                    ₱{selectedReceipt.amount.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>Method:</span>
                  <span className="font-bold" style={{ textAlign: "right" }}>
                    {selectedReceipt.method}
                  </span>
                </div>
                {selectedReceipt.transactionRef && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ textAlign: "left" }}>Ref #:</span>
                    <span className="font-bold" style={{ textAlign: "right" }}>
                      {selectedReceipt.transactionRef}
                    </span>
                  </div>
                )}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>Date Paid:</span>
                  <span className="font-bold" style={{ textAlign: "right" }}>
                    {selectedReceipt.createdAt}
                  </span>
                </div>
              </div>

              {/* CASH PAYMENT DETAILS */}
              <>
                <div className="mb-3 text-center text-xs font-bold">
                  ........................................
                </div>
                <div className="mb-3 space-y-1 text-xs">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ textAlign: "left" }}>Amount Received:</span>
                    <span className="font-black" style={{ textAlign: "right" }}>
                      ₱{selectedReceipt.amount.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ textAlign: "left" }}>Change:</span>
                    <span
                      className="font-black text-green-600"
                      style={{ textAlign: "right" }}
                    >
                      ₱{selectedReceipt.change?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </>

              {/* DIVIDER - TOTAL */}
              <div className="mb-2 text-center text-xs font-black">
                ================================
              </div>

              {/* TOTAL AMOUNT */}
              <div className="mb-3 space-y-1 text-xs">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className="font-bold" style={{ textAlign: "left" }}>
                    TOTAL PAYMENT
                  </span>
                  <span
                    className="text-2xl font-black text-indigo-600"
                    style={{ textAlign: "right" }}
                  >
                    ₱{selectedReceipt.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="mb-3 text-center text-xs font-bold">
                ================================
              </div>

              {/* NEXT BILLING */}
              <div className="mb-4 space-y-1 text-xs">
                <div className="text-center font-bold">NEXT BILLING</div>
                <div className="flex justify-center">
                  <span className="font-bold text-indigo-600">
                    {formatReadableDateTime(selectedReceipt.nextBillingDate)}
                  </span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="mb-3 text-center text-xs font-bold">
                ........................................
              </div>

              {/* FOOTER MESSAGE */}
              <div className="mb-2 text-center text-xs">
                <div className="mb-1">Thank you for your payment!</div>
                <div className="mb-1 font-semibold">
                  Please keep this receipt
                </div>
                <div className="text-xs text-gray-600">for your records</div>
              </div>

              {/* FOOTER INFO */}
              <div className="text-center text-xs text-gray-600">
                <div className="mb-1">For inquiries, please contact:</div>
                <div>📞 (02) XXXX-XXXX</div>
                <div>📧 support@warzone.ph</div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 active:scale-95"
              >
                Close
              </button>

              <button
                onClick={printReceipt}
                className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-green-700 active:scale-95"
              >
                🖨️ Print Receipt
              </button>
            </div>
          </div>
        )}

        {/* CASHIERING MODAL */}
        {cashierBehavior.action == "payment" && selectedCustomerBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-3 text-3xl shadow-md">
                    💵
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">
                      Cash Payment
                    </h3>
                    <p className="text-xs font-semibold text-gray-700">
                      Process payment
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer & Amount Info */}
              <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Customer:
                  </span>
                  <span className="font-black text-gray-900">
                    {selectedCustomerBill.customer}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Amount Due:
                  </span>
                  <span className="text-lg font-black text-indigo-600">
                    ₱{selectedCustomerBill.amount}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Payment Method
                </label>
                <select
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="Cash">💵 Cash</option>
                  <option value="GCash">📱 GCash</option>
                  <option value="Maya">💳 Maya</option>
                  <option value="Bank Transfer">🏦 Bank Transfer</option>
                  <option value="Credit Card">💳 Credit Card</option>
                  <option value="Debit Card">💳 Debit Card</option>
                </select>
              </div>

              {/* Transaction Reference - Only for non-cash payments */}
              {paymentMethod !== "Cash" && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Transaction Reference
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g., TRX123456789 or GCash Ref No."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Transaction Screenshot - Optional for all payments */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Transaction Screenshot (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-center transition-colors hover:border-green-500 hover:bg-green-50">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-2 text-xs font-semibold text-gray-700">
                        {transactionScreenshot
                          ? "✓ Screenshot Added"
                          : "Click to upload screenshot"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshot Preview */}
              {transactionScreenshot && (
                <div className="mb-6 rounded-lg border border-gray-200 p-3">
                  <p className="mb-2 text-xs font-bold text-gray-700">
                    Screenshot Preview:
                  </p>
                  <img
                    src={transactionScreenshot}
                    alt="Transaction Screenshot"
                    className="max-h-40 w-full rounded object-cover"
                  />
                </div>
              )}

              {/* Amount Received Input */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Amount Received
                </label>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => {
                    setAmountReceived(e.target.value);
                    calculateChange(e.target.value);
                  }}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Change Display */}
              {amountReceived &&
                parseFloat(amountReceived) >=
                  parseFloat(selectedCustomerBill.amount) && (
                  <div className="mb-6 rounded-lg bg-green-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-green-800">
                        Change:
                      </span>
                      <span className="text-2xl font-black text-green-600">
                        ₱{change.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

              {/* Warning for insufficient amount */}
              {amountReceived &&
                parseFloat(amountReceived) <
                  parseFloat(selectedCustomerBill.amount) && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-800">
                    ⚠️ Insufficient amount. Need ₱
                    {(
                      parseFloat(selectedCustomerBill.amount) -
                      parseFloat(amountReceived)
                    ).toFixed(2)}{" "}
                    more.
                  </div>
                )}

              {/* Quick Amount Buttons */}
              <div className="mb-6">
                <p className="mb-2 text-xs font-bold text-gray-700">
                  Quick amounts:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        const newAmount =
                          (parseFloat(amountReceived) || 0) + amt;
                        setAmountReceived(newAmount.toString());
                        calculateChange(newAmount.toString());
                      }}
                      className="rounded border border-gray-300 px-2 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      +₱{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCashierBehavior({ action: "", customerId: "" });
                    setAmountReceived("");
                    setChange(0);
                    setPaymentMethod("Cash");
                    setTransactionRef("");
                    setTransactionScreenshot("");
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 active:scale-95"
                >
                  ✕ Cancel
                </button>
                <button
                  onClick={completeCashPayment}
                  disabled={
                    insertPaymentHistory.isLocked ||
                    !amountReceived ||
                    parseFloat(amountReceived) <
                      parseInt(selectedCustomerBill.amount)
                  }
                  className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  ✓ Complete Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT HISTORY MODAL */}
        {cashierBehavior.action == "paymenthistory" && selectedCustomerBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    📋 Payment History
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Customer:{" "}
                    <span className="font-bold">
                      {selectedCustomerBill.customer}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() =>
                    setCashierBehavior({ action: "", customerId: "" })
                  }
                  className="rounded-lg bg-gray-100 px-3 py-1 text-lg font-bold text-gray-600 transition-colors hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Payment History Table */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                        Date
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                        Amount
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                        Method
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!paymentHistories || paymentHistories.length <= 0 ? (
                      <div>No Payment History</div>
                    ) : (
                      paymentHistories
                        .filter((p) => p.userId == selectedCustomerBill.userId)
                        .map((payment, idx) => (
                          <tr
                            key={payment.id}
                            className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                          >
                            <td className="px-3 py-2 font-semibold text-gray-900">
                              {formatReadableDateTime(payment.createdAt)}
                            </td>
                            <td className="px-3 py-2 font-bold text-gray-900">
                              ₱{payment.amount}
                            </td>
                            <td className="px-3 py-2">
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                {payment.method}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${
                                  payment.status === "Paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {payment.status === "Paid"
                                  ? "✓ Paid"
                                  : "⏳ Pending"}
                              </span>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="mb-6 grid grid-cols-3 gap-3 rounded-lg bg-gray-50 p-4">
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-600 uppercase">
                    Total Paid
                  </p>
                  <p className="mt-1 text-2xl font-black text-green-600">
                    ₱
                    {!paymentHistories
                      ? "0"
                      : paymentHistories
                          .filter(
                            (p) =>
                              p.userId === selectedCustomerBill.userId &&
                              p.status === "Paid",
                          )
                          .reduce((sum, p) => sum + parseInt(p.amount), 0)
                          .toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-600 uppercase">
                    Pending
                  </p>
                  <p className="mt-1 text-2xl font-black text-yellow-600">
                    ₱
                    {!paymentHistories
                      ? "0"
                      : paymentHistories
                          .filter(
                            (p) =>
                              p.customer === selectedCustomerBill.customer &&
                              p.status === "Not Yet Paid",
                          )
                          .reduce((sum, p) => sum + parseInt(p.amount), 0)
                          .toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-600 uppercase">
                    Total Billed
                  </p>
                  <p className="mt-1 text-2xl font-black text-blue-600">
                    ₱
                    {!paymentHistories
                      ? "0"
                      : paymentHistories
                          .filter(
                            (p) => p.customer === selectedCustomerBill.customer,
                          )
                          .reduce((sum, p) => sum + parseInt(p.amount), 0)
                          .toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() =>
                  setCashierBehavior({ action: "", customerId: "" })
                }
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-95"
              >
                ✓ Close
              </button>
            </div>
          </div>
        )}

        {/* UPDATE PAYMENT MODAL */}
        {cashierBehavior.action == "updatepayment" && updateBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    ✏️ Update Payment
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Payment ID:{" "}
                    <span className="font-bold">#{updateBill.id}</span>
                  </p>
                </div>
                <button
                  onClick={() =>
                    setCashierBehavior({ action: "", customerId: "" })
                  }
                  className="rounded-lg bg-gray-100 px-3 py-1 text-lg font-bold text-gray-600 transition-colors hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Restricted Info - Read Only */}
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="mb-3 text-xs font-bold text-blue-700 uppercase">
                  ℹ️ Customer & Bill Details (Read-Only)
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Customer:</span>
                    <span className="font-bold">{updateBill.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Amount:</span>
                    <span className="font-bold">
                      ₱{updateBill.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Bill Date:</span>
                    <span className="font-bold">{updateBill.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="mb-6 space-y-4">
                {/* Payment Status */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Payment Status
                  </label>
                  <select
                    value={updateForm.status || ""}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, status: e.target.value })
                    }
                    className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="">Select Status</option>
                    <option value="Paid">✓ Paid</option>
                    <option value="Not Yet Paid">⏳ Not Yet Paid</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Payment Method
                  </label>
                  <select
                    value={updateForm.method || ""}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, method: e.target.value })
                    }
                    className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="">Select Method</option>
                    <option value="Cash">💵 Cash</option>
                    <option value="GCash">📱 GCash</option>
                    <option value="Maya">💳 Maya</option>
                    <option value="Bank Transfer">🏦 Bank Transfer</option>
                    <option value="Credit Card">💳 Credit Card</option>
                    <option value="Debit Card">💳 Debit Card</option>
                  </select>
                </div>

                {/* Transaction Reference */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Transaction Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={updateForm.transactionRef || ""}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        transactionRef: e.target.value,
                      })
                    }
                    placeholder="e.g., TRX123456789"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Information Note */}
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> Customer name, amount, and original
                  bill date cannot be edited. Only payment-related fields can be
                  updated.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setCashierBehavior({ action: "", customerId: "" })
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
                >
                  ✕ Cancel
                </button>
                <button
                  onClick={handleSavePaymentUpdate}
                  className="flex-1 rounded-lg bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-700 active:scale-95"
                >
                  ✓ Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default BillingPage;
