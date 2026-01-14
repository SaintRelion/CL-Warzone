import { registerResource } from "@saintrelion/data-access-layer";

registerResource({
  name: "tickets",
  endpoint: "tickets/",
  store: "Tickets",
});
