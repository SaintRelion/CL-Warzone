import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "billing",
  endpoint: "billing/",
  store: "Billing",
});

registerResource({
  name: "userbilling",
  endpoint: "userbilling/",
  store: "Billing",
});

// registerDerivedResource({
//   name: "userbillings",
//   endpoint: "userbillings/",

//   dependsOn: {
//     user: {
//       filters: () => ({}),
//     },

//     billing: {
//       filters: () => ({}),
//     },

//     paymenthistory: {
//       filters: () => ({}),
//     },
//   },

//   resolve: ({ user, billing, paymenthistory }) => {
//     return billing.map((bill) => {
//       const u = user.find((u) => u.id === bill.userId);

//       const billPayments = paymenthistory.filter(
//         (p) => p.billId === bill.id && p.status === "Completed",
//       );

//       const totalPaid = billPayments.reduce(
//         (sum, p) => sum + Number(p.amount || 0),
//         0,
//       );

//       const totalChangeGivenBack = billPayments.reduce(
//         (sum, p) => sum + Number(p.change || 0),
//         0,
//       );

//       const totalCredits = billPayments.reduce(
//         (sum, p) => sum + Number(p.credit || 0),
//         0,
//       );

//       const remaining = Number(bill.amount) - totalPaid;

//       let status: string;

//       if (totalPaid === 0) {
//         status = new Date() > new Date(bill.dueDate) ? "Overdue" : "Unpaid";
//       } else if (remaining > 0) {
//         status = "Partially Paid";
//       } else {
//         status = "Paid";
//       }

//       return {
//         id: bill.id,
//         subscriptionId: bill.subscriptionId,
//         userId: bill.userId,
//         planId: bill.planId,
//         customer: u ? `${u.firstName} ${u.lastName}` : "",
//         amount: bill.amount,
//         method: bill.method,
//         dueDate: bill.dueDate,
//         createdAt: bill.createdAt,

//         totalPaid,
//         totalChangeGivenBack,
//         totalCredits,
//         remaining: remaining < 0 ? 0 : remaining,
//         status,
//       };
//     });
//   },
// });
