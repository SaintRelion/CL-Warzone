import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "subscription",
  endpoint: "subscription/",
  operations: {
    list: true,
  },
  dependentResources: ["usersubscription"],
});

registerResource({
  name: "usersubscription",
  endpoint: "usersubscription/",
});

// registerDerivedResource({
//   name: "usersubscription",
//   endpoint: "usersubscription/",

//   dependsOn: {
//     subscription: {
//       filters: () => ({}),
//     },

//     user: {
//       filters: (stores) => {
//         const userIds = [
//           ...new Set(stores.subscription.map((sub) => sub.userId)),
//         ];

//         return { id: { in: userIds } };
//       },
//     },
//   },

//   resolve: ({ subscription, user }) =>
//     subscription.map((s) => {
//       const u = user.find((u) => u.id === s.userId);
//       return {
//         ...s,
//         name: u ? `${u.firstName} ${u.lastName}` : "",
//       };
//     }),
// });

// // MOCK DATA
// export const mockSubscriptions = [
//   {
//     id: 1,
//     userId: "1",
//     name: "Juan dela Cruz",
//     planId: "2",
//     balance: "500",
//     address: "Katipunan",
//     status: "Active",
//     nextBillingDate: "January 2, 2026",
//   },
// ];
