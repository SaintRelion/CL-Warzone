import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "user",
  endpoint: "user/",
  store: "User",
  operations: {
    list: true,
  },
  dependentResources: ["usersubscribers"],
});

registerResource({
  name: "usersubscribers",
  endpoint: "usersubscribers/",
  store: "User",
  operations: {
    list: true,
  },
});
