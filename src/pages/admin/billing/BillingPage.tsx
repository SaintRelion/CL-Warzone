import { useState, useRef, useMemo } from "react";

// Compute next due date
const getNextDueDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
};

const BillingPage = () => {
  const receiptRef = useRef(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Cashiering state
  const [showCashier, setShowCashier] = useState(false);
  const [cashierPayment, setCashierPayment] = useState(null);
  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);


  // seed data or mock data 
  const payments = [
    {
      id: 1,
      customer: "Juan dela Cruz",
      amount: 1500,
      method: "GCash",
      date: "2024-11-28",
      status: "Paid",
      nextDueDate: getNextDueDate("2024-11-28"),
    },
    {
      id: 2,
      customer: "Maria Santos",
      amount: 999,
      method: "Bank Transfer",
      date: "2024-11-27",
      status: "Paid",
      nextDueDate: getNextDueDate("2024-11-27"),
    },
    {
      id: 3,
      customer: "Pedro Reyes",
      amount: 1899,
      method: "Cash",
      date: "2024-11-25",
      status: "Not Yet Paid",
      nextDueDate: getNextDueDate("2024-11-25"),
    },
    {
      id: 4,
      customer: "Ana Garcia",
      amount: 1200,
      method: "GCash",
      date: "2024-12-01",
      status: "Paid",
      nextDueDate: getNextDueDate("2024-12-01"),
    },
    {
      id: 5,
      customer: "Carlos Mendoza",
      amount: 1500,
      method: "Cash",
      date: "2024-12-05",
      status: "Not Yet Paid",
      nextDueDate: getNextDueDate("2024-12-05"),
    },
    {
      id: 6,
      customer: "Lisa Tan",
      amount: 2500,
      method: "Bank Transfer",
      date: "2024-12-23",
      status: "Paid",
      nextDueDate: getNextDueDate("2024-12-23"),
    },
  ];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Stats for summary cards
  const totalPaid = payments.filter((p) => p.status === "Paid").length;
  const totalUnpaid = payments.filter((p) => p.status === "Not Yet Paid").length;
  const totalThisMonth = payments.filter((p) => {
    const paymentDate = new Date(p.date);
    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
  }).length;
  const totalRevenue = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);

  const filteredAndSortedPayments = useMemo(() => {
    let result = [...payments];

    if (searchTerm) {
      result = result.filter(
        (payment) =>
          payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.id.toString().includes(searchTerm)
      );
    }

    if (statusFilter === "paid") {
      result = result.filter((p) => p.status === "Paid");
    } else if (statusFilter === "not-paid") {
      result = result.filter((p) => p.status === "Not Yet Paid");
    } else if (statusFilter === "current-month") {
      result = result.filter((p) => {
        const paymentDate = new Date(p.date);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      });
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortBy === "customer") {
        comparison = a.customer.localeCompare(b.customer);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedPayments.length / itemsPerPage);
  const paginatedPayments = filteredAndSortedPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const printReceipt = () => {
    if (!receiptRef.current) return;

    const content = receiptRef.current.innerHTML;
    const win = window.open("", "", "width=400,height=600");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .divider { border-top: 1px dashed #000; margin: 12px 0; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  const handleCashPayment = (payment) => {
    setCashierPayment(payment);
    setShowCashier(true);
    setAmountReceived("");
    setChange(0);
  };

  const calculateChange = (received) => {
    const amount = parseFloat(received) || 0;
    const due = cashierPayment?.amount || 0;
    setChange(Math.max(0, amount - due));
  };

  const completeCashPayment = () => {
    const received = parseFloat(amountReceived) || 0;
    if (received >= cashierPayment.amount) {
      setSelectedPayment({
        ...cashierPayment,
        status: "Paid",
        amountReceived: received,
        change: change
      });
      setShowCashier(false);
    } else {
      alert("Insufficient amount received!");
    }
  };


  // Handler for analytics card clicks
  const handleAnalyticsClick = (type) => {
    if (type === 'paid') {
      setStatusFilter('paid');
    } else if (type === 'unpaid') {
      setStatusFilter('not-paid');
    } else if (type === 'month') {
      setStatusFilter('current-month');
    } else {
      setStatusFilter('all');
    }
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-8xl space-y-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-1">
            Cashiering & Billing
          </h2>
          <p className="text-sm text-gray-600">Manage payments, receipts, and billing cycles</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button 
            type="button" 
            onClick={() => handleAnalyticsClick('paid')} 
            className="rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 shadow-md border border-indigo-200 hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-indigo-400 hover:scale-[1.02] transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600 font-medium">Total Paid</p>
                <p className="text-3xl font-bold text-indigo-700 mt-1">{totalPaid}</p>
              </div>
              <div className="text-4xl opacity-20">✓</div>
            </div>
            <div className="mt-3 w-full bg-indigo-200 rounded-full h-1.5">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full" 
                style={{ width: `${(totalPaid / payments.length) * 100}%` }}
              ></div>
            </div>
          </button>
          <button 
            type="button" 
            onClick={() => handleAnalyticsClick('unpaid')} 
            className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 shadow-md border border-yellow-200 hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-yellow-400 hover:scale-[1.02] transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Unpaid</p>
                <p className="text-3xl font-bold text-yellow-700 mt-1">{totalUnpaid}</p>
              </div>
              <div className="text-4xl opacity-20">⏳</div>
            </div>
            <div className="mt-3 w-full bg-yellow-200 rounded-full h-1.5">
              <div 
                className="bg-yellow-500 h-1.5 rounded-full" 
                style={{ width: `${(totalUnpaid / payments.length) * 100}%` }}
              ></div>
            </div>
          </button>
          <button 
            type="button" 
            onClick={() => handleAnalyticsClick('month')} 
            className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-md border border-green-200 hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-green-400 hover:scale-[1.02] transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">This Month</p>
                <p className="text-3xl font-bold text-green-700 mt-1">{totalThisMonth}</p>
              </div>
              <div className="text-4xl opacity-20">📅</div>
            </div>
            <div className="mt-3 w-full bg-green-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${(totalThisMonth / payments.length) * 100}%` }}
              ></div>
            </div>
          </button>
          <button 
            type="button" 
            onClick={() => handleAnalyticsClick('all')} 
            className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-md border border-purple-200 hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-purple-400 hover:scale-[1.02] transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-700 mt-1">₱{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="text-4xl opacity-20">💰</div>
            </div>
            <div className="mt-3 w-full bg-purple-200 rounded-full h-1.5">
              <div 
                className="bg-purple-500 h-1.5 rounded-full" 
                style={{ width: '100%' }}
              ></div>
            </div>
          </button>
        </div>

        {/* FILTERS AND SEARCH */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">🔍 Filters & Search</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Customer, method, ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="all">All</option>
                <option value="paid">✓ Paid</option>
                <option value="not-paid">⏳ Not Yet Paid</option>
                <option value="current-month">📅 Bill of the Month</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Showing <span className="text-indigo-600 font-bold">{paginatedPayments.length}</span> of{" "}
              <span className="text-indigo-600 font-bold">{filteredAndSortedPayments.length}</span> results
            </span>
          </div>
        </div>

        {/* DATA TABLE - Improved UI */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Payment Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Next Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((payment, idx) => (
                  <tr
                    key={payment.id}
                    className={`transition-colors duration-150 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50/60`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{payment.customer}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-900">
                      <span className="font-semibold">₱{payment.amount.toLocaleString()}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {payment.method}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{payment.date}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-indigo-600">{payment.nextDueDate}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm transition-colors duration-150 ${
                          payment.status === "Paid"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {payment.status === "Paid" ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Paid
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Not Yet Paid
                          </>
                        )}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => {
                          if (payment.method === "Cash" && payment.status === "Not Yet Paid") {
                            handleCashPayment(payment);
                          } else {
                            setSelectedPayment(payment);
                          }
                        }}
                        className={`rounded-lg px-3 py-1 text-xs font-bold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
                          payment.method === "Cash" && payment.status === "Not Yet Paid"
                            ? "bg-green-600 hover:bg-green-700 active:scale-95"
                            : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                        }`}
                      >
                        {payment.method === "Cash" && payment.status === "Not Yet Paid"
                          ? "Process Payment"
                          : "Print Receipt"}
                      </button>
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
                  )
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

        {/* RECEIPT PREVIEW */}
        {selectedPayment && (
          <div className="animate-fadeIn rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
            <div ref={receiptRef} className="mx-auto max-w-md">
              {/* HEADER */}
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 p-3 text-2xl text-indigo-600 shadow-sm">
                  💳
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Payment Receipt
                  </h2>
                  <p className="text-xs text-gray-500">Official Record</p>
                </div>
              </div>

              {/* PLAN INFO */}
              <div className="mb-6 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📶</span>
                  <div>
                    <div className="font-bold text-gray-900">
                      Internet Subscription
                    </div>
                    <div className="text-xs text-gray-600">
                      Monthly Plan • Unlimited Data
                    </div>
                  </div>
                </div>
              </div>

              {/* BREAKDOWN */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid :</span>
                  <span className="font-medium">₱{selectedPayment.amount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method: </span>
                  <span className="font-medium">{selectedPayment.method}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium">{selectedPayment.date}</span>
                </div>

                {selectedPayment.amountReceived && (
                  <>
                    <hr />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Received :</span>
                      <span className="font-medium">₱{selectedPayment.amountReceived}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Change</span>
                      <span className="font-medium text-green-600">₱{selectedPayment.change}</span>
                    </div>
                  </>
                )}

                <hr />

                <div className="flex justify-between font-semibold">
                  <span>Next Billing Date</span>
                  <span className="text-indigo-600">
                    {selectedPayment.nextDueDate}
                  </span>
                </div>
              </div>

              {/* FOOTER INFO */}
              <div className="mt-6 space-y-2 text-xs text-gray-500">
                <div>👤 Customer: {selectedPayment.customer}</div>
                <div>
                  🧾 Receipt No: OR-{selectedPayment.id.toString().padStart(6, "0")}
                </div>
                <div>🔁 Billing Cycle: Monthly</div>
                <div>📍 Service Area: Metro Manila</div>
              </div>

              {/* THANK YOU */}
              <div className="mt-6 text-center text-sm text-gray-600">
                Thank you for your payment.
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 active:scale-95"
              >
                Close
              </button>

              <button
                onClick={printReceipt}
                className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-700 active:scale-95 shadow-md"
              >
                🖨️ Print Receipt
              </button>
            </div>
          </div>
        )}

        {/* CASHIERING MODAL */}
        {showCashier && cashierPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-3 text-3xl shadow-md">💵</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Cash Payment</h3>
                    <p className="text-xs text-gray-500">Process payment</p>
                  </div>
                </div>
              </div>

              {/* Customer & Amount Info */}
              <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="font-semibold text-gray-900">{cashierPayment.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount Due:</span>
                  <span className="text-lg font-bold text-indigo-600">₱{cashierPayment.amount}</span>
                </div>
              </div>

              {/* Amount Received Input */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Change Display */}
              {amountReceived && parseFloat(amountReceived) >= cashierPayment.amount && (
                <div className="mb-6 rounded-lg bg-green-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Change:</span>
                    <span className="text-2xl font-bold text-green-600">₱{change.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Warning for insufficient amount */}
              {amountReceived && parseFloat(amountReceived) < cashierPayment.amount && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  ⚠️ Insufficient amount. Need ₱{(cashierPayment.amount - parseFloat(amountReceived)).toFixed(2)} more.
                </div>
              )}

              {/* Quick Amount Buttons */}
              <div className="mb-6">
                <p className="mb-2 text-xs text-gray-600">Quick amounts:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        const newAmount = (parseFloat(amountReceived) || 0) + amt;
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
                    setShowCashier(false);
                    setCashierPayment(null);
                    setAmountReceived("");
                    setChange(0);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 active:scale-95"
                >
                  ✕ Cancel
                </button>
                <button
                  onClick={completeCashPayment}
                  disabled={!amountReceived || parseFloat(amountReceived) < cashierPayment.amount}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 shadow-md"
                >
                  ✓ Complete Payment
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