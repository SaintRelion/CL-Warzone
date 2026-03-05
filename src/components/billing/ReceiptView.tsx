import { useBillingStore } from "@/stores/billing/useBillingStore";
import {
  formatReadableDate,
  getCurrentDateTimeString,
} from "@saintrelion/time-functions";
import { useRef } from "react";

const ReceiptView = () => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const selectedBillingInfo = useBillingStore((s) => s.selectedBillingInfo);
  const selectedReceipt = useBillingStore((s) => s.selectedPaymentHistory);
  const clearAll = useBillingStore((s) => s.clearAll);

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

  if (selectedReceipt == null || selectedBillingInfo == null) return <></>;

  return (
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
            San Antonio, Looy, Katipunan, Dipolog, Zamboanga del Norte
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mb-3 text-center text-xs font-bold">
          ........................................
        </div>

        {/* RECEIPT INFO */}
        <div className="mb-3 space-y-1 text-xs">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textAlign: "left" }}>RECEIPT NO:</span>
            <span className="font-bold" style={{ textAlign: "right" }}>
              OR-{selectedReceipt.id.toString()}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textAlign: "left" }}>DATE:</span>
            <span className="font-bold" style={{ textAlign: "right" }}>
              {formatReadableDate(getCurrentDateTimeString())}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textAlign: "left" }}>Service:</span>
            <span style={{ textAlign: "right" }}>Internet Subscription</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textAlign: "left" }}>PLAN:</span>
            <span style={{ textAlign: "right" }}>
              {selectedBillingInfo.plan.name}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textAlign: "left" }}>Amount Due:</span>
            <span className="font-bold" style={{ textAlign: "right" }}>
              ₱{selectedBillingInfo.amount.toLocaleString()}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textAlign: "left" }}>Method:</span>
            <span className="font-bold" style={{ textAlign: "right" }}>
              {selectedReceipt.method}
            </span>
          </div>
          {selectedReceipt.transaction_ref && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ textAlign: "left" }}>Ref #:</span>
              <span className="font-bold" style={{ textAlign: "right" }}>
                {selectedReceipt.transaction_ref}
              </span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textAlign: "left" }}>Date Paid:</span>
            <span className="font-bold" style={{ textAlign: "right" }}>
              {selectedReceipt.created_at}
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

            {/* CASH → CHANGE */}
            {selectedReceipt.method === "Cash" &&
              Number(selectedReceipt.change) > 0 && (
                <div className="flex justify-between">
                  <span>Change Given:</span>
                  <span className="font-black text-green-600">
                    ₱{Number(selectedReceipt.change).toLocaleString()}
                  </span>
                </div>
              )}

            {/* NON-CASH → CREDIT */}
            {selectedReceipt.method !== "Cash" &&
              Number(selectedReceipt.credit) > 0 && (
                <div className="flex justify-between">
                  <span>Credit Added:</span>
                  <span className="font-black text-indigo-600">
                    ₱{Number(selectedReceipt.credit).toLocaleString()}
                  </span>
                </div>
              )}
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
              {formatReadableDate(selectedBillingInfo.due_date)}
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
          <div className="mb-1 font-semibold">Please keep this receipt</div>
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
          onClick={() => clearAll()}
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
  );
};
export default ReceiptView;
