import { registerResource, registerDerivedResource } from "@saintrelion/data-access-layer";

// Register the reports resource
registerResource({
  name: "reports",
  endpoint: "reports/",
});

// Register monthly payment report derived resource
registerDerivedResource({
  name: "monthlyPaymentReport",
  endpoint: "reports/monthly-payment-report",

  dependsOn: {
    user: {
      filters: () => ({}),
    },
    billing: {
      filters: () => ({}),
    },
    paymenthistory: {
      filters: () => ({}),
    },
  },

  resolve: ({ user, billing, paymenthistory }) => {
    // This is handled by the backend endpoint
    // Frontend just calls the endpoint directly
    return {
      message: "Use the API endpoint directly to generate reports",
    };
  },
});
