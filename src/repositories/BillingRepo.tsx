import {
  registerDerivedResource,
  registerResource,
} from "@saintrelion/data-access-layer";

registerResource({
  name: "billing",
  endpoint: "billing/",
  store: "Billing",
});

registerDerivedResource({
  name: "userbillings",
  endpoint: "userbillings/",

  dependsOn: {
    user: {
      filters: () => ({}),
    },

    billing: {
      filters: () => ({}),
    },
  },

  resolve: ({ user, billing }) => {
    return billing.map((bill) => {
      const u = user.find((u) => u.id === bill.userId);

      return {
        id: bill.id,
        userId: bill.userId,
        planId: bill.planId,
        customer: u ? `${u.firstName} ${u.lastName}` : "",

        amount: bill.amount,

        method: bill.method,

        paymentDate: "",

        nextBillingDate: bill.nextBillingDate,

        status: bill.status,
      };
    });
  },
});

// MOCK DATA
// const getNextDueDate = (dateString: string): string => {
//   const date = new Date(dateString);
//   date.setDate(date.getDate() + 30);
//   return date.toISOString().split("T")[0];
// };

// export const billings: BillingInfo[] = [
//   {
//     id: "1",
//     customer: "Juan dela Cruz",
//     amount: "1500",
//     method: "GCash",

//     status: "Paid",
//     nextDueDate: getNextDueDate("2025-12-01"),
//     createdAt: "2025-12-01",
//   },
//   {
//     id: "2",
//     customer: "Maria Santos",
//     amount: "999",
//     method: "Bank Transfer",

//     status: "Paid",
//     nextDueDate: getNextDueDate("2025-12-02"),
//     createdAt: "2025-12-02",
//   },
//   {
//     id: "3",
//     customer: "Pedro Reyes",
//     amount: "1899",
//     method: "Cash",

//     status: "Not Yet Paid",
//     nextDueDate: getNextDueDate("2025-12-03"),
//   },
//   {
//     id: "4",
//     customer: "Ana Garcia",
//     amount: "1200",
//     method: "GCash",

//     status: "Paid",
//     nextDueDate: getNextDueDate("2025-12-05"),
//     createdAt: "2025-12-05",
//   },
//   {
//     id: "5",
//     customer: "Carlos Mendoza",
//     amount: "1500",
//     method: "Cash",

//     status: "Not Yet Paid",
//     nextDueDate: getNextDueDate("2025-12-08"),
//   },
//   {
//     id: "6",
//     customer: "Lisa Tan",
//     amount: "2500",
//     method: "Bank Transfer",

//     status: "Paid",
//     nextDueDate: getNextDueDate("2025-12-10"),
//     createdAt: "2025-12-10",
//   },
//   {
//     id: "7",
//     customer: "Robert Santos",
//     amount: "1899",
//     method: "GCash",

//     status: "Paid",
//     nextDueDate: getNextDueDate("2025-12-12"),
//     createdAt: "2025-12-12",
//   },
// ];
